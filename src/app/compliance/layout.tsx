import { ComplianceShell } from "@/features/compliance/components/ComplianceShell";

export default function ComplianceLayout({ children }: { children: React.ReactNode }) {
  return <ComplianceShell>{children}</ComplianceShell>;
}
