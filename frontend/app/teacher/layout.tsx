import ProtectedRoute from "@/components/ProtectedRoute";
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute roleRequired="teacher">{children}</ProtectedRoute>;
}
