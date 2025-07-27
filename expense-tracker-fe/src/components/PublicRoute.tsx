import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p className="text-center mt-20 text-gray-600 text-xl">Loading...</p>;
  }

  // Only render children if user is not authenticated
  return !user ? <>{children}</> : null;
};

export default PublicRoute;
