import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/AuthPage";
export const metadata: Metadata = { title: "登录 CrowMesh", robots: { index: false, follow: false } };
export default function LoginPage() { return <AuthPage />; }
