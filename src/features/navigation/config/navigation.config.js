import {
  Home,
  Dumbbell,
  CalendarDays,
  ChartNoAxesCombined,
  User,
  Settings,
  Target,
  Trophy,
  LogOut,
} from "lucide-react";

export const navigationConfig = {
  primary: [
    {
      id: "home",
      label: "Home",
      icon: Home,
      path: "/",
    },
    {
      id: "programs",
      label: "Programs",
      icon: Dumbbell,
      path: "/programs",
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: CalendarDays,
      path: "/calendar",
    },
    {
      id: "progress",
      label: "Progress",
      icon: ChartNoAxesCombined,
      path: "/progress",
    },
  ],

  secondary: [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/profile",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
    {
      id: "goals",
      label: "Goals",
      icon: Target,
      path: "/goals",
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: Trophy,
      path: "/achievements",
    },
  ],

  actions: [],
};
