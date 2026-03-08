import { theme } from "../theme";

export function Panel({
  title,
  subtitle,
  children,
  accent = theme.accent,
  grow = 0,
  width,
  height
}: {
  title: string;
  subtitle?: string;
  children: any;
  accent?: string;
  grow?: number;
  width?: number | `${number}%` | "auto";
  height?: number | `${number}%` | "auto";
}) {
  return (
    <box
      flexDirection="column"
      flexGrow={grow}
      width={width}
      height={height}
      overflow="hidden"
      border
      borderStyle="rounded"
      borderColor={accent}
      backgroundColor={theme.panel}
      padding={1}
      gap={1}
    >
      <box flexDirection="column">
        <text fg={accent}>
          <strong>{title}</strong>
        </text>
        {subtitle ? <text fg={theme.muted}>{subtitle}</text> : null}
      </box>
      <box flexDirection="column" flexGrow={1} overflow="hidden">
        {children}
      </box>
    </box>
  );
}
