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
  return (
    <box
      width="100%"
      height="100%"
      flexDirection="column"
      backgroundColor={theme.bg}
      padding={1}
      gap={1}
    >
      <box
        border
        borderStyle="double"
        borderColor={theme.accent}
        backgroundColor={theme.panelMuted}
        padding={1}
        justifyContent="space-between"
      >
        <box flexDirection="column" flexGrow={1}>
          <text fg={theme.accent}>
            <strong>{title}</strong>
          </text>
          <text fg={theme.text}>{subtitle}</text>
        </box>
        {progressLabel ? (
          <box border borderStyle="rounded" borderColor={theme.accentSoft} paddingX={1}>
            <text fg={theme.warning}>{progressLabel}</text>
          </box>
        ) : null}
      </box>

      <box flexGrow={1}>{children}</box>

      <box
        border={["top"]}
        borderColor={theme.accentSoft}
        paddingTop={1}
        justifyContent="space-between"
        gap={2}
      >
        {footer}
      </box>
    </box>
  );
}
