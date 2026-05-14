/**
 * NetApp Tiger Team Chart Extension
 *
 * Renders an interactive org chart of the NetApp Tiger Team in the terminal.
 * Type /team to open the chart.
 *
 * Controls:
 *   ↑ ↓ ← →   Navigate between team members
 *   enter      Load the selected member's skill into the editor
 *   esc / q    Close the chart
 */

import type { ExtensionAPI, Theme } from "@mariozechner/pi-coding-agent";
import type { TUI } from "@mariozechner/pi-tui";
import { matchesKey, Key, truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";

// ─── Team Data ───────────────────────────────────────────────────────────────

interface Member {
  id: string;
  emoji: string;
  name: string;
  tagline: string;
  expertise: string[];
  skill: string;
}

const MEMBERS: Member[] = [
  {
    id: "lead",
    emoji: "🎯",
    name: "Tiger Team Lead",
    tagline: "Orchestration · Triage · CSAT",
    expertise: [
      "Escalation triage & severity assessment",
      "Cross-specialist orchestration",
      "Customer communication strategy",
      "CSAT management & executive updates",
      "Timeline & milestone tracking",
    ],
    skill: "/skill:tiger-team-lead",
  },
  {
    id: "solidfire",
    emoji: "💾",
    name: "SolidFire Specialist",
    tagline: "Element OS · HCI · iSCSI · QoS",
    expertise: [
      "SolidFire all-flash clusters",
      "Element OS troubleshooting",
      "iSCSI & Fibre Channel connectivity",
      "QoS policies & multi-tenancy",
      "Drive & node failure recovery",
    ],
    skill: "/skill:solidfire-specialist",
  },
  {
    id: "ontap",
    emoji: "🔷",
    name: "ONTAP Specialist",
    tagline: "FAS/AFF/ASA · SnapMirror · NFS",
    expertise: [
      "ONTAP 9.x — FAS / AFF / ASA",
      "MetroCluster & SVM DR",
      "SnapMirror, SnapVault, Efficiency",
      "NFS · SMB · iSCSI · FC · NVMe-oF",
      "ONTAP Tools for VMware",
    ],
    skill: "/skill:ontap-specialist",
  },
  {
    id: "storagegrid",
    emoji: "🌐",
    name: "StorageGRID Specialist",
    tagline: "S3 · ILM · Object Lock · Grid",
    expertise: [
      "S3 API & object storage",
      "ILM policy design & troubleshooting",
      "Grid topology & node health",
      "Tenant & bucket management",
      "Object Lock (WORM) & versioning",
    ],
    skill: "/skill:storagegrid-specialist",
  },
  {
    id: "hardware",
    emoji: "🔧",
    name: "Hardware Specialist",
    tagline: "E-Series · SANtricity · HBAs",
    expertise: [
      "E-Series / EF-Series arrays",
      "SANtricity OS & MEL analysis",
      "Disk shelves & drive replacement",
      "FC / iSCSI / NVMe HBA connectivity",
      "FAS/AFF hardware components",
    ],
    skill: "/skill:netapp-hardware-specialist",
  },
  {
    id: "docs",
    emoji: "📝",
    name: "Documentation Expert",
    tagline: "RCA · Reports · Confluence · DOCX",
    expertise: [
      "RCA reports (Markdown / HTML / DOCX)",
      "Executive summaries & briefings",
      "Confluence wiki pages",
      "Status updates & customer communications",
      "Timeline documentation",
    ],
    skill: "/skill:documentation-expert",
  },
];

// ─── Grid Navigation ─────────────────────────────────────────────────────────
//
//  Row 0:  [0] lead          (full width)
//  Row 1:  [1] solidfire   [2] ontap
//  Row 2:  [3] storagegrid [4] hardware
//  Row 3:  [5] docs          (full width)

const GRID: number[][] = [[0], [1, 2], [3, 4], [5]];

function findPos(idx: number): [number, number] {
  for (let r = 0; r < GRID.length; r++) {
    for (let c = 0; c < GRID[r].length; c++) {
      if (GRID[r][c] === idx) return [r, c];
    }
  }
  return [0, 0];
}

function navigate(current: number, dir: "up" | "down" | "left" | "right"): number {
  const [row, col] = findPos(current);
  if (dir === "up" && row > 0) {
    const nr = row - 1;
    return GRID[nr][Math.min(col, GRID[nr].length - 1)];
  }
  if (dir === "down" && row < GRID.length - 1) {
    const nr = row + 1;
    return GRID[nr][Math.min(col, GRID[nr].length - 1)];
  }
  if (dir === "left" && col > 0) return GRID[row][col - 1];
  if (dir === "right" && col < GRID[row].length - 1) return GRID[row][col + 1];
  return current;
}

// ─── String Helpers ───────────────────────────────────────────────────────────

/** Center a string (by visible width) inside a field of `len` chars. */
function centerIn(str: string, len: number): string {
  const w = visibleWidth(str);
  const extra = Math.max(0, len - w);
  const l = Math.floor(extra / 2);
  const r = extra - l;
  return " ".repeat(l) + str + " ".repeat(r);
}

// ─── TUI Component ────────────────────────────────────────────────────────────

class TeamChart {
  private selected = 0;
  private cachedWidth?: number;
  private cachedLines?: string[];

  constructor(
    private readonly tui: TUI,
    private readonly theme: Theme,
    private readonly done: (result: number | null) => void,
  ) {}

  handleInput(data: string): void {
    let next = this.selected;

    if (matchesKey(data, Key.up))    next = navigate(this.selected, "up");
    else if (matchesKey(data, Key.down))  next = navigate(this.selected, "down");
    else if (matchesKey(data, Key.left))  next = navigate(this.selected, "left");
    else if (matchesKey(data, Key.right)) next = navigate(this.selected, "right");
    else if (matchesKey(data, Key.escape) || data === "q" || data === "Q") {
      this.done(null);
      return;
    } else if (matchesKey(data, Key.enter)) {
      this.done(this.selected);
      return;
    }

    if (next !== this.selected) {
      this.selected = next;
      this.invalidate();
      this.tui.requestRender();
    }
  }

  render(width: number): string[] {
    if (this.cachedLines && this.cachedWidth === width) return this.cachedLines;
    this.cachedLines = this.build(width);
    this.cachedWidth = width;
    return this.cachedLines;
  }

  invalidate(): void {
    this.cachedWidth = undefined;
    this.cachedLines = undefined;
  }

  // ── Core renderer ───────────────────────────────────────────────────────

  private build(width: number): string[] {
    const t = this.theme;
    const lines: string[] = [];

    // ── Layout maths ───────────────────────────────────────────────────────
    //  Leader box: centered, max 44 chars wide
    const LEAD_W = Math.min(width, 44);
    const leadLeft = Math.floor((width - LEAD_W) / 2);
    const leadCenter = leadLeft + Math.floor(LEAD_W / 2);

    //  Two-column specialist boxes, 3-char gap between
    const GAP = 3;
    const colW = Math.floor((width - GAP) / 2);
    const leftCenter  = Math.floor(colW / 2);
    const rightCenter = colW + GAP + Math.floor(colW / 2);

    // ── Box renderer ───────────────────────────────────────────────────────
    const drawBox = (idx: number, boxW: number, isSel: boolean): string[] => {
      const m = MEMBERS[idx];
      const inner = boxW - 2;

      const border = isSel
        ? (s: string) => t.fg("accent", s)
        : (s: string) => t.fg("border", s);
      const nameStyle = isSel
        ? (s: string) => t.fg("accent", t.bold(s))
        : (s: string) => t.fg("text", s);
      const tagStyle = (s: string) => t.fg("muted", s);

      const title = `${m.emoji} ${m.name}`;
      const titleFit = visibleWidth(title) > inner
        ? truncateToWidth(title, inner - 2) + ".."
        : title;

      const tagFit = visibleWidth(m.tagline) > inner
        ? truncateToWidth(m.tagline, inner - 2) + ".."
        : m.tagline;

      return [
        border("┌") + border("─".repeat(inner)) + border("┐"),
        border("│") + nameStyle(centerIn(titleFit, inner)) + border("│"),
        border("│") + tagStyle(centerIn(tagFit, inner)) + border("│"),
        border("└") + border("─".repeat(inner)) + border("┘"),
      ];
    };

    // Indent a box to the right by `lp` spaces
    const indent = (blines: string[], lp: number): string[] =>
      blines.map(l => " ".repeat(lp) + l);

    // ── Connector helpers ──────────────────────────────────────────────────
    const vLine = (col: number): string => {
      const a = Array(width).fill(" ");
      a[col] = "│";
      return t.fg("border", a.join(""));
    };

    // Horizontal spread: ┌──┴──┐  connecting down from `top` to two drops
    const spreadLine = (): string => {
      const a = Array(width).fill(" ");
      for (let i = leftCenter; i <= rightCenter; i++) a[i] = "─";
      a[leftCenter]  = "┌";
      a[rightCenter] = "┐";
      // clamp leadCenter to valid range
      const tc = Math.min(Math.max(leadCenter, leftCenter), rightCenter);
      a[tc] = tc === leftCenter ? "├" : tc === rightCenter ? "┤" : "┴";
      return t.fg("border", a.join(""));
    };

    // Two vertical drops (left col center and right col center)
    const dropLine = (): string => {
      const a = Array(width).fill(" ");
      a[leftCenter]  = "│";
      a[rightCenter] = "│";
      return t.fg("border", a.join(""));
    };

    // ── Title bar ──────────────────────────────────────────────────────────
    lines.push(t.fg("accent",  centerIn("🦁  N E T A P P   T I G E R   T E A M", width)));
    lines.push(t.fg("accent", "═".repeat(width)));
    lines.push("");

    // ── Leader ─────────────────────────────────────────────────────────────
    lines.push(...indent(drawBox(0, LEAD_W, this.selected === 0), leadLeft));

    // ── Leader → Row 1 connector ───────────────────────────────────────────
    lines.push(vLine(leadCenter));
    lines.push(spreadLine());
    lines.push(dropLine());

    // ── Row 1: SolidFire │ ONTAP ───────────────────────────────────────────
    const r1L = drawBox(1, colW, this.selected === 1);
    const r1R = drawBox(2, colW, this.selected === 2);
    for (let i = 0; i < r1L.length; i++) {
      lines.push(r1L[i] + " ".repeat(GAP) + r1R[i]);
    }

    // ── Row 1 → Row 2 connector ────────────────────────────────────────────
    lines.push(dropLine());

    // ── Row 2: StorageGRID │ Hardware ──────────────────────────────────────
    const r2L = drawBox(3, colW, this.selected === 3);
    const r2R = drawBox(4, colW, this.selected === 4);
    for (let i = 0; i < r2L.length; i++) {
      lines.push(r2L[i] + " ".repeat(GAP) + r2R[i]);
    }

    // ── Docs (centered, full lead width) ───────────────────────────────────
    lines.push("");
    lines.push(...indent(drawBox(5, LEAD_W, this.selected === 5), leadLeft));

    // ── Detail panel ───────────────────────────────────────────────────────
    lines.push("");
    lines.push(t.fg("border", "─".repeat(width)));

    const m = MEMBERS[this.selected];
    lines.push(t.fg("accent", t.bold(`  ${m.emoji}  ${m.name}`)));
    lines.push(t.fg("muted",  `     ${m.tagline}`));
    lines.push(t.fg("border", "·".repeat(width)));

    for (const item of m.expertise) {
      lines.push("  " + t.fg("dim", "• ") + t.fg("text", item));
    }

    lines.push("");
    lines.push("  " + t.fg("dim", "Skill: ") + t.fg("accent", m.skill));

    // ── Footer ─────────────────────────────────────────────────────────────
    lines.push("");
    lines.push(t.fg("border", "─".repeat(width)));
    lines.push(
      "  " +
      t.fg("dim", "↑↓←→ navigate") +
      t.fg("border", "  •  ") +
      t.fg("dim", "enter load skill") +
      t.fg("border", "  •  ") +
      t.fg("dim", "esc close"),
    );

    return lines.map(l => truncateToWidth(l, width));
  }
}

// ─── Extension Entry Point ────────────────────────────────────────────────────

export default function (pi: ExtensionAPI) {
  pi.registerCommand("team", {
    description: "Show the NetApp Tiger Team org chart",
    handler: async (_args, ctx) => {
      const result = await ctx.ui.custom<number | null>(
        (tui, theme, _kb, done) => new TeamChart(tui, theme, done),
        {
          overlay: true,
          overlayOptions: {
            anchor: "center",
            width: "80%",
            minWidth: 62,
            maxHeight: "95%",
          },
        },
      );

      if (result !== null) {
        const member = MEMBERS[result];
        ctx.ui.notify(`Loading: ${member.name} — ${member.skill}`, "info");
        ctx.ui.setEditorText(member.skill);
      }
    },
  });
}
