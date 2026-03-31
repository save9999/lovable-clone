"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return null;
  if (status === "authenticated") return null;

  // Non connecté : landing page avec redirection vers login
  const handleStart = async (prompt: string) => {
    router.push(`/login?prompt=${encodeURIComponent(prompt)}`);
  };

  return <LandingPage onStart={handleStart} />;
}
