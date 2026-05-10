import { Suspense } from "react";
import { RegisterPage } from "@/components/RegisterPage";

export default function Page() {
  return (
    <Suspense fallback={<main className="auth-shell" />}>
      <RegisterPage />
    </Suspense>
  );
}
