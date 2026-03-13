import { theme } from "../theme";

export function Panel({
  title,
  subtitle,
  children,
  accent = theme.accent,
  grow = 0,
  framed = true,
  width,
  height
}: {
  title: string;
  subtitle?: string;
  children: any;
  accent?: string;
  grow?: number;
  framed?: boolean;
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
      border={framed ? ["left"] : undefined}
      borderColor={framed ? accent : undefined}
      backgroundColor={framed ? theme.panel : "transparent"}
      paddingLeft={framed ? 1 : 0}
      paddingRight={framed ? 1 : 0}
      paddingY={framed ? 1 : 0}
      gap={1}
    >
      <box flexDirection="column" gap={0}>
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
