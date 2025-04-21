// /src/utils/toastUtils.js

import { toast } from "react-toastify";

const toastConfig = {
  autoClose: 5000, // Automatically close after 5 seconds
  position: "top-right", // Display at the top right
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
};

/**
 * Handles displaying toast notifications based on the type of message.
 * @param {string|Object} error - The error message or object received.
 * @param {Object} config - Configuration options for the toast.
 */
export const handleErrorToastNotifications = (error) => {
  if (typeof error === "string" && error.startsWith("Error:")) {
    toast.error(error, toastConfig);
  } else {
    toast.warning(error, toastConfig);
  }

  if (error[0]) {
    toast.warning(error[0].msg, toastConfig);
  }
};

export const handleSuccessToastNotifications = (message) => {
  toast.success(message, toastConfig);
};
