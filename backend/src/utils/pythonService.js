import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateReportWithPython = (reportData, reportType, outputFormat = 'pdf') => {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(__dirname, '../../services/reporting_service.py');
    
    if (!fs.existsSync(pythonScriptPath)) {
      reject(new Error('Python reporting service not found'));
      return;
    }

    const inputData = {
      reportData,
      reportType,
      outputFormat,
    };

    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    const pythonProcess = spawn(pythonCmd, [pythonScriptPath], {
      cwd: path.dirname(pythonScriptPath),
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python process stderr:', stderr);
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        const result = JSON.parse(stdout);
        if (result.error) {
          reject(new Error(result.error));
          return;
        }

        const fileBuffer = Buffer.from(result.fileData, 'base64');
        resolve(fileBuffer);
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${error.message}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });

    setTimeout(() => {
      pythonProcess.kill();
      reject(new Error('Python process timeout'));
    }, 30000);
  });
};

