import { CircleCheck, CircleX, TriangleAlert, Info } from "lucide-react";

export const notificationConfig = {
  success: {
    icon: CircleCheck,

    iconClass: "text-emerald-500",

    progressClass: "bg-emerald-500",
  },

  error: {
    icon: CircleX,

    iconClass: "text-red-500",

    progressClass: "bg-red-500",
  },

  warning: {
    icon: TriangleAlert,

    iconClass: "text-amber-500",

    progressClass: "bg-amber-500",
  },

  info: {
    icon: Info,

    iconClass: "text-blue-500",

    progressClass: "bg-blue-500",
  },
};
