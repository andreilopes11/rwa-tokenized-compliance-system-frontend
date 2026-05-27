import { AuditShell } from "@/features/audit/components/AuditShell";

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return <AuditShell>{children}</AuditShell>;
}
