import { useTerminalDimensions } from "@opentui/react";

import { theme } from "../theme";

export function AppFrame({
  title,
  subtitle,
  progressLabel,
  children,
  footer
}: {
  title: string;
  subtitle: string;
  progressLabel?: string;
  children: any;
  footer: any;
}) {
  const { width } = useTerminalDimensions();
  const compactHeader = width < 132;

  return (
    <box
      width="100%"
      height="100%"
      flexDirection="column"
      backgroundColor={theme.bg}
      paddingX={1}
      paddingY={1}
      gap={1}
    >
      <box
        backgroundColor={theme.panelMuted}
        paddingX={1}
        paddingY={1}
        border={["bottom"]}
        borderColor={theme.accentSoft}
        flexDirection={compactHeader ? "column" : "row"}
        alignItems={compactHeader ? "flex-start" : undefined}
        justifyContent="space-between"
        gap={2}
      >
        <box flexDirection="column" flexGrow={1}>
          <text fg={theme.text}>
            <strong>{title}</strong>
          </text>
          <text fg={theme.muted}>{subtitle}</text>
        </box>
        {progressLabel ? (
          <box paddingLeft={compactHeader ? 0 : 2}>
            <text fg={theme.accent}>{progressLabel}</text>
          </box>
        ) : null}
      </box>

      <box flexGrow={1}>{children}</box>

      <box
        border={["top"]}
        borderColor={theme.accentSoft}
        paddingTop={1}
        flexDirection="column"
        gap={1}
      >
        {footer}
      </box>
    </box>
  );
}
