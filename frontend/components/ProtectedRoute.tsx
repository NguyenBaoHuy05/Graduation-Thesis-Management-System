"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({
  children,
  roleRequired,
}: {
  children: React.ReactNode;
  roleRequired: string;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const handleRedirect = async () => {
      if (!isAuthenticated) {
        await router.push("/login");
        setLoading(false);
        return;
      }

      if (!user?.role || !user) {
        await router.push("/login");
        setLoading(false);
        return;
      }

      await router.push(`/${user.role}`);
      if (mounted) setLoading(false);
    };

    handleRedirect();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user, roleRequired, router]);

  //   const redirecting =
  //     (!isAuthenticated && roleRequired === "login") || !!user?.role;
  //   if (redirecting) return null;
  if (loading) return null;
  return <>{children}</>;
}
