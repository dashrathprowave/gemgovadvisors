"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasCredentials } from "@/lib/admin/api";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    if (hasCredentials()) {
      router.push("/admin/overview");
    }
  }, [router]);

  return null; // The layout handles login/redirect
}