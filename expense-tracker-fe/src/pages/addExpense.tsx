import api from "@/lib/axios";
import Form from "../components/Form";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { showToast } from "@/utils/toast";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

interface Category {
  id: number;
  name: string;
}
const AddExpense = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if (!user?.id) return;
    const fetchCategories = async () => {
      if (!user?.id) {
        console.log("No user ID available");
        return;
      }
      setLoading(true);
      try {
        const response = await api.get(`/category/${user?.id}`);
        setCategories(response.data);

        console.log("Categories:", response.data);
      } catch (error) {
        toast.error("Failed to fetch categories");
        console.error("Failed to fetch categories", error);
        setCategories([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [user]);

  if (loading) {
    console.log("Still loading...");
    return <div>Loading categories...</div>;
  }
  const formConfig = {
    fields: [
      {
        name: "title",
        label: "Title",
        type: "text" as const,
        placeholder: "Enter expense title",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea" as const,
        placeholder: "Enter expense description",
        required: false,
      },
      {
        name: "category_id",
        label: "Category",
        type: "select" as const,
        placeholder: "Select a category",
        options: categories.map((category) => ({
          value: category.id,
          label: category.name,
        })),
        required: true,
      },
      {
        name: "amount",
        label: "Amount",
        type: "number" as const,
        placeholder: "Enter expense amount",
        required: true,
      },
      {
        name: "date",
        label: "Date",
        type: "date" as const,
        placeholder: "Enter expense date",
        required: true,
      },
    ],
    onSubmit: async (data: any) => {
      try {
        const response = await api.post("/expense", {
          ...data,
          user_id: user?.id,
        });
        showToast.success("Expense added successfully");
        router.push("/dashboard");
      } catch (error) {
        showToast.error("Failed to add expense");
        console.error("Failed to add expense", error);
      }
    },
    submitLabel: "Add Expense",
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Expense</h1>
          <Form {...formConfig} />
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
