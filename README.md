# 🦁 NetApp Tiger Team — pi Components

This repo contains the **pi coding agent** configuration for the NetApp Escalation Tiger Team workspace.
It is designed to be cloned into a directory that engineers use as their escalation working folder.

> ⚠️ **Never commit customer data.** All `CPE-*/` case folders are `.gitignore`d by design.

---

## 📦 What's in this repo

```
.
├── AGENTS.md                          # pi system context — loaded automatically on session start
├── .gitignore                         # Excludes CPE-* case folders and session data
│
└── .pi/
    ├── extensions/
    │   └── team-chart.ts              # /team command — interactive org chart TUI overlay
    │
    ├── prompts/
    │   ├── new-escalation.md          # /new-escalation — scaffold a new CPE case folder
    │   ├── triage.md                  # /triage — Tiger Team Lead triage workflow
    │   └── escalation-report.md      # /escalation-report — generate a formal report
    │
    └── skills/
        ├── tiger-team-lead/SKILL.md
        ├── solidfire-specialist/SKILL.md
        ├── ontap-specialist/SKILL.md
        ├── storagegrid-specialist/SKILL.md
        ├── netapp-hardware-specialist/SKILL.md
        └── documentation-expert/SKILL.md
```

---

## 🚀 Setup

```bash
# Clone into your escalations working directory
git clone https://github.com/solarisjon/pi-components.git ~/Escalations

# Open pi in that directory — everything loads automatically
cd ~/Escalations
pi
```

pi will auto-discover:
- `AGENTS.md` → system context & startup behaviour
- `.pi/extensions/` → registers `/team` command
- `.pi/prompts/` → registers `/triage`, `/new-escalation`, `/escalation-report`
- `.pi/skills/` → loads specialist skills on demand

---

## ⚡ Quick Commands

| Command | Description |
|---------|-------------|
| `/team` | Open the interactive Tiger Team org chart |
| `/new-escalation` | Scaffold a new `CPE-xxx-Customer` folder |
| `/triage` | Triage the current escalation |
| `/escalation-report` | Generate a formal escalation report |
| `/skill:tiger-team-lead` | Engage the Tiger Team Lead |
| `/skill:ontap-specialist` | Engage the ONTAP Specialist |
| `/skill:solidfire-specialist` | Engage the SolidFire Specialist |
| `/skill:storagegrid-specialist` | Engage the StorageGRID Specialist |
| `/skill:netapp-hardware-specialist` | Engage the Hardware Specialist |
| `/skill:documentation-expert` | Engage the Documentation Expert |

---

## 🗂 Escalation Folder Convention

Case folders are created locally and **never pushed to this repo**.

```
CPE-042-Acme/
├── README.md        # Escalation summary & current status
├── timeline.md      # Chronological event log
├── logs/            # Raw logs from customer systems
├── configs/         # Running configs, snapshots
├── reports/         # Generated RCA, status updates
└── notes/           # Engineer working notes
```

---

## 🔄 Keeping Up To Date

```bash
cd ~/Escalations
git pull origin main
```

pi will pick up any new skills, prompts, or extensions automatically on the next session.
