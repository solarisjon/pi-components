---
description: Generate a formal escalation report from the current case folder — choose RCA, status update, executive summary, HTML, Confluence, or DOCX format
argument-hint: "<CPE-folder-path> [report-type]"
---
Please generate a formal report for escalation $1.

Report type requested: $2

Using the Documentation Expert skill:

1. Read all files in $1 — README.md, timeline.md, notes/, logs/ (summaries), configs/ (relevant excerpts)
2. Ask any clarifying questions needed before writing
3. Produce the report in the requested format:
   - `rca` → Full Root Cause Analysis report (Markdown + HTML)
   - `status` → Customer-facing status update email
   - `exec` → Executive summary (non-technical, 1 page)
   - `confluence` → Confluence wiki page format
   - `html` → Self-contained HTML report file
   - `docx` → Pandoc-compatible Markdown for DOCX conversion
   - (default if not specified) → Ask me which format I need

4. Save the report to `$1/reports/` with a timestamped filename
5. Confirm where the file was saved and offer to produce it in additional formats
