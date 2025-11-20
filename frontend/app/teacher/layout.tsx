import ProtectedRoute from "@/components/ProtectedRoute";
export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute roleRequired="teacher">{children}</ProtectedRoute>;
}
