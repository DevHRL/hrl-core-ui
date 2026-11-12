const TONES = {
  ok: { fg: "var(--ok-text)", bg: "var(--success-soft)", line: "var(--success)" },
  info: { fg: "var(--info-text)", bg: "var(--info-soft)", line: "var(--info)" },
  warn: { fg: "var(--warning-text)", bg: "var(--warning-soft)", line: "var(--warning)" },
  crit: { fg: "var(--danger-text)", bg: "var(--destructive-soft)", line: "var(--destructive)" },
  none: { fg: "var(--neutral-text)", bg: "var(--neutral-soft)", line: "var(--input-border)" },
  violet: { fg: "var(--violet-text)", bg: "var(--violet-soft)", line: "var(--violet)" }
};
function toneVars(tone, outline = false) {
  const t = TONES[tone] ?? TONES.none;
  return {
    "--tone-fg": t.fg,
    "--tone-bg": outline ? "var(--surface)" : t.bg,
    "--tone-line": t.line
  };
}
export {
  TONES,
  toneVars
};
//# sourceMappingURL=tones.js.map
