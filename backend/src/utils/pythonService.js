import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checkPythonAvailable = () => {
  return new Promise((resolve) => {
    const pythonCmd = "python3";
    const checkProcess = spawn(pythonCmd, ["--version"], { stdio: "pipe" });

    checkProcess.on("close", (code) => {
      resolve(code === 0);
    });

    checkProcess.on("error", () => {
      resolve(false);
    });

    setTimeout(() => {
      checkProcess.kill();
      resolve(false);
    }, 2000);
  });
};

export const generateReportWithPython = (
  reportData,
  reportType,
  outputFormat = "pdf"
) => {
  return new Promise(async (resolve, reject) => {
    const pythonScriptPath = path.join(
      __dirname,
      "../../services/reporting_service.py"
    );

    if (!fs.existsSync(pythonScriptPath)) {
      reject(new Error("Python reporting service not found"));
      return;
    }

    const pythonAvailable = await checkPythonAvailable();
    if (!pythonAvailable) {
      console.error("❌ Python 3 is not installed or not available in PATH");
      console.error(
        "💡 PDF/Excel reports require Python 3 with pandas, matplotlib, and openpyxl"
      );
      console.error("💡 Falling back to JSON format");
      reject(new Error("Python 3 is not installed or not available in PATH"));
      return;
    }

    console.log(
      "✅ Python service is available - using Python for report generation"
    );

    const inputData = {
      reportData,
      reportType,
      outputFormat,
    };

    const pythonCmd = "python3";

    const pythonProcess = spawn(pythonCmd, [pythonScriptPath], {
      cwd: path.dirname(pythonScriptPath),
      env: { ...process.env, PYTHONUNBUFFERED: "1" },
    });

    let stdout = "";
    let stderr = "";

    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      stderr += data.toString();
      console.error("Python stderr:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("❌ Python process failed with code:", code);
        console.error("Python stderr:", stderr);
        console.error("Python stdout:", stdout);
        reject(
          new Error(
            `Python process exited with code ${code}. ${
              stderr ||
              "Check if Python dependencies (pandas, matplotlib, openpyxl) are installed."
            }`
          )
        );
        return;
      }

      try {
        const result = JSON.parse(stdout);
        if (result.error) {
          console.error("❌ Python service returned error:", result.error);
          reject(new Error(result.error));
          return;
        }

        if (!result.fileData) {
          console.error("❌ Python service did not return fileData");
          reject(new Error("Python service did not return file data"));
          return;
        }

        console.log("✅ Python service generated report successfully");
        const fileBuffer = Buffer.from(result.fileData, "base64");
        resolve(fileBuffer);
      } catch (error) {
        console.error("❌ Failed to parse Python output:", error.message);
        console.error("Python stdout:", stdout);
        reject(new Error(`Failed to parse Python output: ${error.message}`));
      }
    });

    pythonProcess.on("error", (error) => {
      if (error.code === "ENOENT") {
        reject(
          new Error(
            `Python not found. Please ensure Python 3 is installed and available in PATH. Tried: ${pythonCmd}`
          )
        );
      } else {
        reject(new Error(`Failed to start Python process: ${error.message}`));
      }
    });

    setTimeout(() => {
      pythonProcess.kill();
      reject(new Error("Python process timeout"));
    }, 30000);
  });
};
