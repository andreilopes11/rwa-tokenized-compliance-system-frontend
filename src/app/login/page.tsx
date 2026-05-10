import { Suspense } from "react";
import { LoginPage } from "@/components/LoginPage";

export default function Page() {
  return (
    <Suspense fallback={<main className="auth-shell" />}>
      <LoginPage />
    </Suspense>
  );
}
