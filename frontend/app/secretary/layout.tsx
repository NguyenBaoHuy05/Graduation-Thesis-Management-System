import ProtectedRoute from "@/components/ProtectedRoute";
export default function SecretaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute roleRequired="secretary">{children}</ProtectedRoute>;
}
