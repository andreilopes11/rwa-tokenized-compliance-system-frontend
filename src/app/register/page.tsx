import { Suspense } from "react";
import { RegisterPage } from "@/features/auth/components/RegisterPage";

export default function Page() {
  return (
    <Suspense fallback={<main className="auth-shell" />}>
      <RegisterPage />
    </Suspense>
  );
}
