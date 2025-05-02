"use client";

import AuthGuard from "@/components/AuthGuard";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="flex justify-center items-center min-h-[80vh]">
        <AuthForm isLogin={true} />
      </div>
    </AuthGuard>
  );
}
