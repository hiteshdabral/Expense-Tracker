import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { Transaction } from "@/types/transactions";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<{id: number; name: string}[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [expenseRes, categoryRes] = await Promise.all([
          api.get(`/expense/${user.id}`),
          api.get(`/category/${user.id}`),
        ]);
        setExpenses(expenseRes.data);
        setCategories(categoryRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <p className="text-center mt-20 text-gray-600 text-xl">
        Loading dashboard...
      </p>
    );
  }

  // Memoize filtered expenses
  const filteredExpenses = useMemo(() => 
    selectedMonth
      ? expenses.filter(
          (exp) => new Date(exp.date).getMonth() + 1 === Number(selectedMonth)
        )
      : expenses,
    [expenses, selectedMonth]
  );

  // Memoize grouped expenses
  const groupedExpenses = useMemo(() => 
    categories.map((category) => {
      const categoryExpenses = filteredExpenses.filter(
        (exp) => exp.category_id === category.id
      );
      const total = categoryExpenses.reduce(
        (sum, exp) => sum + parseFloat(exp.amount),
        0
      );
      return { ...category, expenses: categoryExpenses, total };
    }),
    [categories, filteredExpenses]
  );

  // Memoize pie chart data
  const pieData = useMemo(() => 
    groupedExpenses
      .filter((g) => g.total > 0)
      .map((g) => ({ name: g.name, value: g.total })),
    [groupedExpenses]
  );

  // Memoize total expense
  const totalExpense = useMemo(() =>
    groupedExpenses.reduce((sum, group) => sum + group.total, 0),
    [groupedExpenses]
  );

  // Memoized CSV download function
  const downloadCSV = useCallback(() => {
    const header = "Amount,Description,Category,Date\n";
    const rows = expenses
      .map(
        (e) =>
          `${e.amount},${e.description},${
            categories.find((c) => c.id === e.category_id)?.name
          },${new Date(e.date).toLocaleDateString()}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
  }, [expenses, categories]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center flex-wrap mb-6">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Hello, {user?.name} 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's your financial overview
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center h-10"
                title="Logout"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
                Logout
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
              <button
                onClick={() => router.push("/addCategory")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 text-lg font-medium flex items-center justify-center shadow-md hover:shadow-xl border-2 border-green-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Category
              </button>
              <button
                onClick={() => router.push("/addExpense")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 text-lg font-medium flex items-center justify-center shadow-md hover:shadow-xl border-2 border-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Expense
              </button>
            </div>
          </div>

          {/* Rest of the dashboard content */}
          {/* ... */}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
