// pages/dashboard.tsx
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>
        <p>This is your dashboard.</p>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
