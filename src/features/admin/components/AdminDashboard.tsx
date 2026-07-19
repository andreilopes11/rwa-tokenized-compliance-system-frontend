/**
 * @deprecated Orphan monolith — `/admin` redirects to `/governance`.
 * Use role workspaces: `/compliance`, `/governance`, `/audit`.
 * Kept only so accidental imports fail loudly instead of bypassing SA-S02 rules.
 */
export function AdminDashboard() {
  throw new Error(
    "AdminDashboard is retired. Use /governance (SA-S02), /compliance, or /audit workspaces."
  );
}
