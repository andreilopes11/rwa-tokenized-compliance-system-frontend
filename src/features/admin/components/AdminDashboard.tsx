/**
 * @deprecated Orphan monolith — `/admin` redirects to `/governance`.
 * Two-role model: everything staff-related lives under `/governance` (SUPER_ADMIN).
 * Kept only so accidental imports fail loudly instead of bypassing SA-S02 rules.
 */
export function AdminDashboard() {
  throw new Error("AdminDashboard is retired. Use the /governance workspace (SUPER_ADMIN).");
}
