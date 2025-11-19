import ProtectedRoute from "@/components/ProtectedRoute";
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute roleRequired="admin">{children}</ProtectedRoute>;
}
