---
description: Create a new escalation folder with README, timeline, and folder structure for a new CPE case
argument-hint: "<CPE-number> <CustomerName>"
---
I need to set up a new escalation. Please:

1. Create the folder structure for case $1 - $2:
   ```
   CPE-$1-$2/
   ├── README.md
   ├── timeline.md
   ├── logs/
   ├── configs/
   ├── reports/
   └── notes/
   ```

2. Create `CPE-$1-$2/README.md` with this template filled out as best you can from the arguments provided, leaving placeholders for anything unknown:
   - Case Number: CPE-$1
   - Customer Name: $2
   - Date Opened: (today)
   - Severity: (ask me)
   - Products Involved: (ask me)
   - Problem Statement: (ask me)
   - Current Status: Open
   - NetApp Owner: (ask me)
   - Customer Contact: (ask me)
   - SE/AM: (ask me)

3. Create `CPE-$1-$2/timeline.md` with a header table ready to populate.

4. Ask me the key triage questions to complete the README — use the Tiger Team Lead skill to guide the triage.
