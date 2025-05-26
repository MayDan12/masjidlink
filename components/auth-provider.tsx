"use client";

import { AuthProvider } from "@/context/auth";

function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

export default Providers;
