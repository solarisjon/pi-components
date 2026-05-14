# NetApp Tiger Team — Escalation Hub

You are operating inside the **NetApp Escalation Tiger Team workspace**. This directory contains active customer escalations. Each escalation lives in its own subfolder named `CPE-xxx-Customer` (e.g., `CPE-042-Acme`).

---

## 🚀 Session Startup

**When a new session begins in this directory, your very first action must be to greet the engineer and ask:**

> "👋 Welcome to the NetApp Tiger Team Escalation Hub! Which CPE case are we working on today? (e.g., `CPE-042-Acme`)"

Do not proceed with any other action until the engineer provides a CPE case number. Once provided:

1. `ls` the relevant `CPE-xxx-Customer` folder
2. **Read `state.md` first** — this is the live investigation state. If it exists, summarise where the team left off before doing anything else
3. Read `README.md` and `timeline.md` for full context
4. Then read any logs, configs, or notes relevant to the current focus area
5. Tell the engineer: *"Here's where we left off…"* and propose the immediate next action

If `state.md` does not exist, create it as part of onboarding the new escalation.

---

## 🎯 Your Operating Context

**Working directory:** `/Users/solarisjon/Escalations`

When the user mentions or opens an escalation, always:
1. `ls` the relevant `CPE-xxx-Customer` folder to understand what files exist
2. **Read `state.md` first** — it holds the live investigation state, current hypotheses, and next steps
3. Read `README.md` and `timeline.md` for background and chronology
4. Read any logs, configs, or reports relevant to the current focus area
5. Engage the appropriate specialist skill(s) for the technology involved
6. **Keep `state.md` updated** after every meaningful finding, decision, or action taken

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
├── state.md            # ⭐ LIVE investigation state — always read this first
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

### `state.md` — The Investigation State File

`state.md` is the single source of truth for *where the investigation is right now*. It must be updated after every meaningful action so any engineer can pick up the case without asking "where did we leave off?"

Required sections:

```markdown
# Escalation State — CPE-XXX-Customer
_Last updated: YYYY-MM-DD HH:MM UTC — [Engineer/Role]_

## 🔴 Current Status
**Phase:** [Triage | Investigation | Workaround Applied | Pending Customer | Pending Engineering | Resolved]
**Severity:** [P1 | P2 | P3 | P4]
**Active Specialists:** [e.g., ONTAP Specialist, Tiger Team Lead]

## 🧠 What We Know (Mental Model)
- Concise bullet-point summary of confirmed facts
- Include versions, topology, symptoms, and confirmed non-causes

## ✅ Completed Actions
- [x] Action taken — outcome — timestamp

## ⏳ In Progress
- [ ] What is actively being worked right now

## 🚧 Blockers
- What are we waiting on? From whom? By when?

## 🔜 Next Steps (ordered)
1. Immediate next action
2. Follow-on action
3. ...

## 💡 Hypotheses
| # | Hypothesis | Status | Supporting Evidence |
|---|-----------|--------|--------------------|
| 1 | ... | Likely / Unlikely / Ruled Out | ... |

## 📞 Next Customer Update Due
YYYY-MM-DD HH:MM UTC
```

If these files don't exist yet, create them as you work.

---

## 🔄 Standard Escalation Workflow

1. **Triage** → Run `/triage` or ask the Tiger Team Lead to assess severity and assign specialists
2. **Investigate** → Load relevant specialist skills, read logs/configs, identify root cause
3. **Track** → Update both `state.md` (current focus/next steps) and `timeline.md` (event log) after every meaningful action
4. **Document** → Use the Documentation Expert to produce reports for the customer/management
5. **Close** → Generate a final RCA report, mark `state.md` as Resolved, and close the escalation

> 💡 **State discipline:** Treat `state.md` like a whiteboard that is always visible to the whole team. Before ending a session, always update it so the next engineer can orient in under 60 seconds.

---

## 🗂️ Git Discipline

This workspace is a git repository. After **any** file is created or modified in an escalation folder, always:

```bash
git add -A && git commit -m "<type>(CPE-XXX): <short description>"
git push
```

Commit message types:
- `feat` — new escalation, new report, new notes
- `update` — state.md, timeline, ongoing investigation notes
- `fix` — correcting an error in a document
- `close` — final RCA, escalation resolved

Example: `update(CPE-042): hypothesis 2 ruled out, new blocker added to state.md`

> Never leave files uncommitted at the end of a session. The git history is the team's audit trail.

---

## ⚡ Quick Commands

- `/new-escalation` — Start a brand-new escalation folder and README
- `/triage` — Triage the current escalation with the Tiger Team Lead
- `/escalation-report` — Generate a formal report for the current escalation
- `/skill:tiger-team-lead` — Engage the Tiger Team Lead directly
- `/skill:documentation-expert` — Engage the Documentation Expert
