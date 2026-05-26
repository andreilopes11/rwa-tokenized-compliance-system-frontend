import type { AuthRole } from "./useAuthRole";
import { isValidEmail, isValidWalletAddress, meetsPasswordPolicy, type PasswordChecks } from "./validators";

export function getRegisterFormBlockers(input: {
  confirmPassword: string;
  email: string;
  inviteCode: string;
  password: string;
  passwordChecks: PasswordChecks;
  role: AuthRole;
  walletAddress: string;
}): string[] {
  const blockers: string[] = [];

  if (!isValidEmail(input.email)) {
    blockers.push("Enter a valid email address.");
  }
  if (!meetsPasswordPolicy(input.passwordChecks)) {
    blockers.push("Password must have 8+ characters, one uppercase letter, and one number.");
  }
  if (input.password.length > 0 && input.confirmPassword !== input.password) {
    blockers.push("Confirm password must match.");
  } else if (input.password.length > 0 && input.confirmPassword.length === 0) {
    blockers.push("Confirm your password.");
  }
  if (input.role === "admin" && !input.inviteCode.trim()) {
    blockers.push("Admin invite code is required.");
  }
  if (input.walletAddress && !isValidWalletAddress(input.walletAddress)) {
    blockers.push("Wallet address must be valid or left empty.");
  }

  return blockers;
}
