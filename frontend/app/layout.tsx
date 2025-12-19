import type { Metadata } from "next";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Fit-HCMUE-GTMS",
  description:
    "Graduation Thesis Management System for HCMUE Faculty of Information Technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <ApolloWrapper>{children}</ApolloWrapper>
        </body>
      </AuthProvider>
    </html>
  );
}
