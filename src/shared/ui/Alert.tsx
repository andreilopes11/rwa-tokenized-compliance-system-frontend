import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

type AlertTone = "error" | "success" | "info" | "warning";

type AlertProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  tone?: AlertTone;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const toneConfig = {
  error: { icon: AlertCircle, live: "assertive" as const, role: "alert" as const },
  success: { icon: CheckCircle2, live: "polite" as const, role: "status" as const },
  info: { icon: Info, live: "polite" as const, role: "status" as const },
  warning: { icon: TriangleAlert, live: "polite" as const, role: "status" as const }
} satisfies Record<AlertTone, { icon: typeof AlertCircle; live: "assertive" | "polite"; role: "alert" | "status" }>;

export function Alert({ children, className, title, tone = "info" }: AlertProps) {
  const config = toneConfig[tone];
  const Icon = config.icon;

  return (
    <div
      aria-live={config.live}
      className={cx("ui-alert", `ui-alert-${tone}`, className)}
      role={config.role}
    >
      <Icon aria-hidden className="ui-alert-icon" size={18} />
      <div className="ui-alert-content">
        {title ? <strong>{title}</strong> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}
