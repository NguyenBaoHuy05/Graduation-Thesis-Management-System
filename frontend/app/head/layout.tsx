import ProtectedRoute from "@/components/ProtectedRoute";
export default function HeadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute roleRequired="head">{children}</ProtectedRoute>;
}
