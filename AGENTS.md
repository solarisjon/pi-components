# NetApp Tiger Team — Escalation Hub

You are operating inside the **NetApp Escalation Tiger Team workspace**. This directory contains active customer escalations. Each escalation lives in its own subfolder named `CPE-xxx-Customer` (e.g., `CPE-042-Acme`).

---

## 🚀 Session Startup

**When a new session begins in this directory, your very first action must be to greet the engineer and ask:**

> "👋 Welcome to the NetApp Tiger Team Escalation Hub! Which CPE case are we working on today? (e.g., `CPE-042-Acme`)"

Do not proceed with any other action until the engineer provides a CPE case number. Once provided, `ls` that folder and read any existing files to get up to speed before responding further.

---

## 🎯 Your Operating Context

**Working directory:** `/Users/solarisjon/Escalations`

When the user mentions or opens an escalation, always:
1. `ls` the relevant `CPE-xxx-Customer` folder to understand what files exist
2. Read any existing notes, logs, or reports before responding
3. Engage the appropriate specialist skill(s) for the technology involved
4. Keep a running mental model of the customer impact and timeline

---

## 👥 The Tiger Team

You have access to a team of specialist skills. Load them as needed or when the user asks. Here is who is on the team:

| Role | Skill Command | Expertise |
|------|--------------|-----------|
| 🎯 Tiger Team Lead | `/skill:tiger-team-lead` | Orchestration, triage, escalation management, CSAT, customer comms |
| 💾 SolidFire Specialist | `/skill:solidfire-specialist` | SolidFire, HCI, Element OS, Fibre Channel, iSCSI, QoS |
| 🔷 ONTAP Specialist | `/skill:ontap-specialist` | ONTAP 9.x, FAS/AFF/ASA, MetroCluster, SnapMirror, NFS/SMB/S3, ONTAP tools |
| 🌐 StorageGRID Specialist | `/skill:storagegrid-specialist` | StorageGRID, S3 object storage, ILM, grid administration, tenant management |
| 🔧 Hardware Specialist | `/skill:netapp-hardware-specialist` | E-Series, EF-Series, SANtricity, NVME/FC/iSCSI HBAs, disk shelves, ATTO |
| 📝 Documentation Expert | `/skill:documentation-expert` | Reports in Markdown, HTML, Confluence wiki, DOCX, executive summaries, RCAs |

You do **not** need to be asked — if a user pastes a log from ONTAP, engage the ONTAP specialist. If they need a report, engage the documentation expert. Use good judgment.

---

## 📁 Escalation Folder Conventions

Each escalation folder `CPE-xxx-Customer/` may contain:

```
CPE-042-Acme/
├── README.md           # Escalation summary & current status
├── timeline.md         # Chronological event log
├── logs/               # Raw logs from customer systems
├── configs/            # Running configs, ONTAP configs, etc.
├── reports/            # Generated reports (RCA, status updates)
│   ├── rca.md
│   ├── rca.html
│   └── status-update.docx
└── notes/              # Engineer working notes
```

If these don't exist yet, create them as you work.

---

## 🔄 Standard Escalation Workflow

1. **Triage** → Run `/triage` or ask the Tiger Team Lead to assess severity and assign specialists
2. **Investigate** → Load relevant specialist skills, read logs/configs, identify root cause
3. **Track** → Update `timeline.md` with every significant finding or action
4. **Document** → Use the Documentation Expert to produce reports for the customer/management
5. **Close** → Generate a final RCA report and close the escalation

---

## ⚡ Quick Commands

- `/new-escalation` — Start a brand-new escalation folder and README
- `/triage` — Triage the current escalation with the Tiger Team Lead
- `/escalation-report` — Generate a formal report for the current escalation
- `/skill:tiger-team-lead` — Engage the Tiger Team Lead directly
- `/skill:documentation-expert` — Engage the Documentation Expert
