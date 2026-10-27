import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/AuthPage";
export const metadata: Metadata = { title: "注册 CrowMesh", robots: { index: false, follow: false } };
export default function RegisterPage() { return <AuthPage register />; }
