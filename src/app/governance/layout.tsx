import { GovernanceShell } from "@/features/governance/components/GovernanceShell";

export default function GovernanceLayout({ children }: { children: React.ReactNode }) {
  return <GovernanceShell>{children}</GovernanceShell>;
}
