"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginForm switchToRegister={() => setIsLogin(false)} />
  ) : (
    <RegisterForm switchToLogin={() => setIsLogin(true)} />
  );
}