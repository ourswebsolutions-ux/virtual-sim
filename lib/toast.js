import { toast } from "react-hot-toast";

export const ShowError = (message) => {
  toast.error(message);
};

export const ShowSuccess = (message) => {
  toast.success(message);
};