"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({
  children,
  roleRequired,
}: {
  children: React.ReactNode;
  roleRequired?: string;
}) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (!isAuthenticated) {
        if (pathname !== "/login") router.replace("/login");
        return;
      }

      if (roleRequired && user?.role !== roleRequired) {
        const dest = user?.role ? `/${user.role}` : "/login";
        if (pathname !== dest) router.replace(dest);
      }
    } catch {
      console.error("Error in ProtectedRoute useEffect");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, roleRequired, router, pathname]);
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  if (
    !isAuthenticated ||
    (roleRequired && user?.role !== roleRequired && roleRequired === "login")
  )
    return null;

  return <>{children}</>;
}
