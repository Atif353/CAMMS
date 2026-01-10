#!/usr/bin/env python3

import sys

import json

import base64

import io

from datetime import datetime

import warnings

warnings.filterwarnings("ignore")

import pandas as pd

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt

from matplotlib.backends.backend_pdf import PdfPages

from openpyxl.styles import PatternFill, Font, Alignment, Border, Side

from openpyxl.utils import get_column_letter

THEME_COLORS = {

    "primary": "#003f5c",

    "secondary": "#2f4b7c",

    "accent": "#665191",

    "success": "#2ecc71",

    "warning": "#f1c40f",

    "danger": "#e74c3c",

    "light_bg": "#f7f9fb",
}

plt.rcParams.update({

    "font.family": "DejaVu Sans",

    "axes.titlesize": 12,

    "axes.labelsize": 10,

    "xtick.labelsize": 8,

    "ytick.labelsize": 8,
})

def build_overall_summary(report_data: dict) -> dict:
    instructors = report_data.get("instructorSummary", [])

    total_instructors = len(instructors)

    total_time = 0

    total_completed = 0

    total_pending = 0

    total_activities = 0

    activity_type_aggregate = {}

    for instr in instructors:

        total_time += instr.get("overallTimeSpent", 0) or 0

        total_completed += instr.get("completedActivities", 0) or 0

        total_pending += instr.get("pendingActivities", 0) or 0

        totals = instr.get("totals", {}) or {}

        for at_code, stats in totals.items():

            count = stats.get("count", 0) or 0

            time_spent = stats.get("timeSpent", 0) or 0

            total_activities += count

            if at_code not in activity_type_aggregate:

                activity_type_aggregate[at_code] = {"count": 0, "timeSpent": 0}

            activity_type_aggregate[at_code]["count"] += count

            activity_type_aggregate[at_code]["timeSpent"] += time_spent

    completion_rate = 0

    if total_activities > 0:

        completion_rate = round((total_completed / total_activities) * 100, 2)

    return {

        "totalInstructors": total_instructors,

        "totalActivities": total_activities,

        "totalTimeSpent": total_time,

        "totalCompleted": total_completed,

        "totalPending": total_pending,

        "completionRate": completion_rate,

        "activityTypeAggregate": activity_type_aggregate,
    }

def add_title_page(pdf: PdfPages, report_data: dict, report_type: str):

    fig = plt.figure(figsize=(11.7, 8.3))

    ax = fig.add_subplot(111)

    ax.set_facecolor(THEME_COLORS["primary"])

    ax.axis("off")

    start = report_data.get("startDate", "")

    end = report_data.get("endDate", "")

    generated_at = report_data.get("generatedAt") or datetime.utcnow().isoformat()

    fig.text(

        0.5, 0.75,

        "Course Activity Management & Monitoring System",

        ha="center", va="center",

        fontsize=24, color="white", weight="bold"

    )

    fig.text(

        0.5, 0.65,

        f"{report_type.title()} Activity Report",

        ha="center", va="center",

        fontsize=18, color="#ecf0f1"

    )

    fig.text(

        0.5, 0.55,

        f"Period: {start}  →  {end}",

        ha="center", va="center",

        fontsize=12, color="#dcdde1"

    )

    fig.text(

        0.5, 0.47,

        f"Generated on: {generated_at}",

        ha="center", va="center",

        fontsize=10, color="#bdc3c7"
    )

    fig.text(

        0.01, 0.02,

        "Powered by CAMMS",

        ha="left", va="center",

        fontsize=8, color="#ecf0f1"

    )

    pdf.savefig(fig, bbox_inches="tight")

    plt.close(fig)

def add_overall_summary_page(pdf: PdfPages, report_data: dict):

    overall = build_overall_summary(report_data)

    instructors = report_data.get("instructorSummary", [])

    fig, axes = plt.subplots(1, 2, figsize=(11.7, 8.3))

    fig.suptitle("Executive Summary", fontsize=16, fontweight="bold", color=THEME_COLORS["primary"])

    ax = axes[0]

    ax.axis("off")

    lines = [

        f"Total Instructors: {overall['totalInstructors']}",

        f"Total Activities: {overall['totalActivities']}",

        f"Total Time Spent: {overall['totalTimeSpent']} min",

        f"Completed Activities: {overall['totalCompleted']}",

        f"Pending Activities: {overall['totalPending']}",

        f"Completion Rate: {overall['completionRate']} %",

    ]

    y = 0.9

    for text in lines:

        ax.text(0.05, y, text, fontsize=11, color=THEME_COLORS["secondary"])

        y -= 0.08

    ax2 = axes[1]

    agg = overall["activityTypeAggregate"]

    if agg:

        labels = list(agg.keys())

        counts = [agg[a]["count"] for a in labels]

        abbreviated_labels = [label[:15] + "..." if len(label) > 15 else label for label in labels]

        bars = ax2.bar(abbreviated_labels, counts, color=THEME_COLORS["accent"])

        ax2.set_title("Activities by Type (Count)", fontsize=12, fontweight="bold")

        ax2.set_xlabel("Activity Type", fontsize=10)

        ax2.set_ylabel("Count", fontsize=10)

        ax2.tick_params(axis="x", rotation=45, labelsize=8)

        max_count = max(counts) if counts else 0
        for i, (bar, v) in enumerate(zip(bars, counts)):

            height = bar.get_height()

            ax2.text(bar.get_x() + bar.get_width() / 2., height + max_count * 0.01,

                    str(v), ha="center", va="bottom", fontsize=8)

        ax2.grid(axis="y", alpha=0.3)

        plt.tight_layout(rect=[0, 0, 1, 0.95])

    else:

        ax2.axis("off")

        ax2.text(

            0.5, 0.5,

            "No activity data available for this period.",

            ha="center", va="center",

            fontsize=11, color="gray"

        )

    plt.tight_layout(rect=[0, 0, 1, 0.95])

    pdf.savefig(fig, bbox_inches="tight")

    plt.close(fig)

    if instructors:

        fig, ax = plt.subplots(figsize=(11.7, 8.3))

        names = [i.get("name", "Unknown") for i in instructors]

        times = [i.get("overallTimeSpent", 0) for i in instructors]

        ax.barh(names, times, color=THEME_COLORS["secondary"])

        ax.set_title("Time Spent by Instructor (Minutes)", fontsize=12, fontweight="bold")

        ax.set_xlabel("Minutes", fontsize=10)

        ax.invert_yaxis()

        for i, v in enumerate(times):

            ax.text(v, i, f" {v}", va="center", fontsize=8)

        ax.grid(axis="x", alpha=0.3)

        plt.tight_layout()

        pdf.savefig(fig, bbox_inches="tight")

        plt.close(fig)

def add_instructor_pages(pdf: PdfPages, report_data: dict):

    instructors = report_data.get("instructorSummary", [])

    if not instructors:

        return

    for instr in instructors:

        name = instr.get("name", "Unknown Instructor")

        email = instr.get("email", "N/A")

        totals = instr.get("totals", {}) or {}

        fig, ax = plt.subplots(figsize=(11.7, 8.3))

        fig.suptitle(f"Instructor: {name}", fontsize=14, fontweight="bold", color=THEME_COLORS["primary"])

        ax.set_facecolor(THEME_COLORS["light_bg"])

        ax.axis("off")

        header_lines = [

            f"Name: {name}",

            f"Email: {email}",

            f"Total Time Spent: {instr.get('overallTimeSpent', 0)} min",

            f"Completed Activities: {instr.get('completedActivities', 0)}",

            f"Pending Activities: {instr.get('pendingActivities', 0)}",

        ]

        y = 0.90

        for text in header_lines:

            fig.text(0.05, y, text, fontsize=10, color=THEME_COLORS["secondary"])

            y -= 0.05

        if totals:

            activity_types = list(totals.keys())

            counts = [totals[a]["count"] for a in activity_types]

            time_spent = [totals[a]["timeSpent"] for a in activity_types]

            abbreviated_types = [at[:15] + "..." if len(at) > 15 else at for at in activity_types]

            chart_ax = fig.add_axes([0.1, 0.15, 0.8, 0.4])

            bars = chart_ax.bar(abbreviated_types, counts, color=THEME_COLORS["accent"])

            chart_ax.set_title("Activities by Type (Count)", fontsize=11, fontweight="bold")

            chart_ax.set_xlabel("Activity Type", fontsize=9)

            chart_ax.set_ylabel("Count", fontsize=9)

            chart_ax.tick_params(axis="x", rotation=45, labelsize=8)

            max_count = max(counts) if counts else 0
            for i, (bar, v) in enumerate(zip(bars, counts)):

                height = bar.get_height()

                chart_ax.text(bar.get_x() + bar.get_width() / 2., height + max_count * 0.01,

                        str(v), ha="center", va="bottom", fontsize=8)

            chart_ax.grid(axis="y", alpha=0.3)

        pdf.savefig(fig, bbox_inches="tight")

        plt.close(fig)

        if totals:

            fig2, ax2 = plt.subplots(figsize=(11.7, 8.3))

            ax2.axis("off")

            table_data = []

            for at, stats in totals.items():

                count = stats.get("count", 0) or 0

                t_spent = stats.get("timeSpent", 0) or 0

                avg_time = round(t_spent / count, 2) if count > 0 else 0

                table_data.append([at, count, t_spent, avg_time])

            col_labels = ["Activity Type", "Count", "Time Spent (min)", "Avg Time per Activity (min)"]

            table = ax2.table(

                cellText=table_data,

                colLabels=col_labels,

                cellLoc="center",

                loc="center"

            )

            table.auto_set_font_size(False)

            table.set_fontsize(9)

            table.scale(1, 1.5)

            ax2.set_title("Activity Breakdown", fontsize=12, fontweight="bold")

            pdf.savefig(fig2, bbox_inches="tight")

            plt.close(fig2)

def generate_pdf_report(report_data: dict, report_type: str) -> bytes:

    buffer = io.BytesIO()

    with PdfPages(buffer) as pdf:

        add_title_page(pdf, report_data, report_type)

        add_overall_summary_page(pdf, report_data)

        add_instructor_pages(pdf, report_data)

    buffer.seek(0)

    return buffer.getvalue()

def style_worksheet(ws):

    header_fill = PatternFill(start_color="003f5c", end_color="003f5c", fill_type="solid")

    header_font = Font(color="FFFFFF", bold=True)

    center_alignment = Alignment(horizontal="center", vertical="center")

    thin_border = Border(

        left=Side(style="thin"),

        right=Side(style="thin"),

        top=Side(style="thin"),

        bottom=Side(style="thin"),
    )

    for col in range(1, ws.max_column + 1):

        cell = ws.cell(row=1, column=col)

        cell.fill = header_fill

        cell.font = header_font

        cell.alignment = center_alignment

        cell.border = thin_border

    for row in range(2, ws.max_row + 1):

        fill = None

        if row % 2 == 0:

            fill = PatternFill(start_color="f7f9fb", end_color="f7f9fb", fill_type="solid")

        for col in range(1, ws.max_column + 1):

            cell = ws.cell(row=row, column=col)

            if fill:

                cell.fill = fill

            cell.border = thin_border

    for col in range(1, ws.max_column + 1):

        column_letter = get_column_letter(col)

        max_length = 0

        for row in range(1, ws.max_row + 1):

            cell = ws[f"{column_letter}{row}"]

            if cell.value:

                max_length = max(max_length, len(str(cell.value)))

        ws.column_dimensions[column_letter].width = max(12, min(max_length + 2, 40))

    ws.freeze_panes = "A2"

def generate_excel_report(report_data: dict, report_type: str) -> bytes:

    buffer = io.BytesIO()

    instructors = report_data.get("instructorSummary", [])

    overall = build_overall_summary(report_data)

    with pd.ExcelWriter(buffer, engine="openpyxl") as writer:

        summary_rows = []

        for instr in instructors:

            total_activities = 0

            for stats in (instr.get("totals") or {}).values():

                total_activities += stats.get("count", 0) or 0

            completion_rate = 0

            if total_activities > 0:

                completion_rate = round(

                    (instr.get("completedActivities", 0) or 0) / total_activities * 100, 2

                )

            summary_rows.append({

                "Instructor Name": instr.get("name", "Unknown"),

                "Email": instr.get("email", ""),

                "Total Activities": total_activities,

                "Total Time Spent (min)": instr.get("overallTimeSpent", 0),

                "Completed Activities": instr.get("completedActivities", 0),

                "Pending Activities": instr.get("pendingActivities", 0),

                "Completion Rate (%)": completion_rate,

            })

        df_summary = pd.DataFrame(summary_rows) if summary_rows else pd.DataFrame(

            columns=[

                "Instructor Name", "Email", "Total Activities",

                "Total Time Spent (min)", "Completed Activities",

                "Pending Activities", "Completion Rate (%)",

            ]

        )

        df_summary.to_excel(writer, sheet_name="Summary", index=False)

        ws_summary = writer.book["Summary"]

        style_worksheet(ws_summary)

        last_row = ws_summary.max_row + 2

        ws_summary[f"A{last_row}"] = "Overall Totals"

        ws_summary[f"A{last_row}"].font = Font(bold=True, color="000000")

        ws_summary[f"A{last_row + 1}"] = "Total Instructors"

        ws_summary[f"B{last_row + 1}"] = overall["totalInstructors"]

        ws_summary[f"A{last_row + 2}"] = "Total Activities"

        ws_summary[f"B{last_row + 2}"] = overall["totalActivities"]

        ws_summary[f"A{last_row + 3}"] = "Total Time Spent (min)"

        ws_summary[f"B{last_row + 3}"] = overall["totalTimeSpent"]

        ws_summary[f"A{last_row + 4}"] = "Completion Rate (%)"

        ws_summary[f"B{last_row + 4}"] = overall["completionRate"]

        for instr in instructors:

            totals = instr.get("totals", {}) or {}

            if not totals:

                continue

            detail_data = []

            for at_code, stats in totals.items():

                count = stats.get("count", 0) or 0

                time_spent = stats.get("timeSpent", 0) or 0

                avg_time = round(time_spent / count, 2) if count > 0 else 0

                detail_data.append({

                    "Activity Type": at_code,

                    "Count": count,

                    "Time Spent (min)": time_spent,

                    "Avg Time per Activity (min)": avg_time,

                })

            df_detail = pd.DataFrame(detail_data)

            sheet_name = instr.get("name", "Instructor")[:31] or "Instructor"

            df_detail.to_excel(writer, sheet_name=sheet_name, index=False)

            ws = writer.book[sheet_name]

            style_worksheet(ws)

    buffer.seek(0)

    return buffer.getvalue()

def main():

    try:

        input_data = json.load(sys.stdin)

        report_data = input_data.get("reportData", {})

        report_type = input_data.get("reportType", "WEEKLY")

        output_format = input_data.get("outputFormat", "pdf").lower()

        if output_format == "pdf":

            file_bytes = generate_pdf_report(report_data, report_type)

        elif output_format == "excel":

            file_bytes = generate_excel_report(report_data, report_type)

        else:

            raise ValueError(f"Unsupported output format: {output_format}")

        file_base64 = base64.b64encode(file_bytes).decode("utf-8")

        result = {

            "success": True,

            "fileData": file_base64,

            "format": output_format,

        }

        print(json.dumps(result))

    except Exception as e:

        error_result = {

            "success": False,

            "error": str(e),

        }

        print(json.dumps(error_result))

        sys.exit(1)

if __name__ == "__main__":

    main()
