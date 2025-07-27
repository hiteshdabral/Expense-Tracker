import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { Transaction } from "@/types/transactions";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

const Dashboard = () => {
  // All hooks must be called before any conditional returns
  const { user, logout } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<{id: number; name: string}[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  
  // Handlers
  const handleLogout = useCallback(async () => {
    await logout();
    router.push('/login');
  }, [logout, router]);

  // Memoized CSV download function
  const handleDownloadCSV = useCallback(() => {
    if (!expenses || !categories) return;
    
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
  // Memoized calculations
  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    return selectedMonth
      ? expenses.filter(
          (exp) => new Date(exp.date).getMonth() + 1 === Number(selectedMonth)
        )
      : expenses;
  }, [expenses, selectedMonth]);

  const groupedExpenses = useMemo(() => {
    if (!categories || !filteredExpenses) return [];
    return categories.map((category) => {
      const categoryExpenses = filteredExpenses.filter(
        (exp) => exp.category_id === category.id
      );
      const total = categoryExpenses.reduce(
        (sum, exp) => sum + parseFloat(exp.amount),
        0
      );
      return { ...category, expenses: categoryExpenses, total };
    });
  }, [categories, filteredExpenses]);

  const pieData = useMemo(() => {
    if (!groupedExpenses) return [];
    return groupedExpenses
      .filter((g) => g.total > 0)
      .map((g) => ({ name: g.name, value: g.total }));
  }, [groupedExpenses]);

  const totalExpense = useMemo(() => {
    if (!groupedExpenses) return 0;
    return groupedExpenses.reduce((sum, group) => sum + group.total, 0);
  }, [groupedExpenses]);

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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Total Expenses */}
            <div className="p-4 border border-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 bg-white">
              <h2 className="text-lg font-semibold">Total Expenses</h2>
              <p className="text-xl font-bold">₹{totalExpense.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total spending recorded</p>
            </div>

            {/* Total Categories */}
            <div className="p-4 border rounded-lg shadow">
              <h2 className="text-lg font-semibold">Categories</h2>
              <p className="text-xl font-bold">{categories.length}</p>
              <p className="text-sm text-gray-600">Active expense categories</p>
            </div>

            {/* Total Transactions */}
            <div className="p-4 border rounded-lg shadow">
              <h2 className="text-lg font-semibold">Transactions</h2>
              <p className="text-xl font-bold">{expenses.length}</p>
              <p className="text-sm text-gray-600">
                Total transactions recorded
              </p>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white shadow-md border border-gray-100 p-4 rounded-lg mb-6 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-lg transition-shadow duration-200">
            <label className="font-medium text-gray-700 mb-2 sm:mb-0">
              Filter by Month:
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-200 px-3 py-2 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors duration-200"
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            {pieData.length > 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Expense Distribution
                </h2>
                <PieChart width={400} height={300}>
                  <Pie
                    data={pieData}
                    cx={200}
                    cy={150}
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`
                    }
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-600">
                <p>No data to show in chart.</p>
              </div>
            )}

            {/* Expense List */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Expenses by Category
              </h2>
              <div className="space-y-6">
                {groupedExpenses.map((group) => (
                  <div key={group.id} className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {group.name}
                        </span>
                        <span className="text-gray-500 text-sm">
                          ({group.expenses.length} txns)
                        </span>
                      </span>
                      <span className="font-bold text-blue-600">
                        ₹{group.total.toFixed(2)}
                      </span>
                    </div>
                    {group.expenses.length > 0 ? (
                      <ul className="space-y-2">
                        {group.expenses.map((exp) => (
                          <li
                            key={exp.id}
                            className="flex justify-between items-center text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition"
                          >
                            <span>{exp.description}</span>
                            <div className="text-right">
                              <div className="font-medium">₹{exp.amount}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(exp.date).toLocaleDateString(
                                  undefined,
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">
                        No expenses in this category.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export CSV Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleDownloadCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition inline-flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
