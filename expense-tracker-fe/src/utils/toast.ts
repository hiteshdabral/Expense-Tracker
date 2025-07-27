import { error } from "console";
import toast from "react-hot-toast";

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      style: {
        background: "#4CAF50",
        color: "#fff",
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 3000,
      style: {
        background: "#F44336",
        color: "#fff",
      },
    });
  },
};
