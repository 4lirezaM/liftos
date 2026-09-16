// src/app/router/router.jsx

import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import RootLayout from "../../shared/layout/RootLayout.jsx";
import AppLayout from "../../shared/layout/AppLayout.jsx";

// Auth
import {
  LoginPage,
  SignupPage,
  ProfilePage,
  ProtectedRoute,
} from "../../features/auth";

// Home
import HomePage from "../../pages/Homepage.jsx";

// Programs
import {
  ProgramsPage,
  ProgramDetailsPage,
  PlanDetailsPage,
} from "../../features/programs";

// Workout
import {
  WorkoutSessionPage,
  WorkoutHistoryPage,
  WorkoutDetailsPage,
} from "../../features/workout";

// Progress
import { ProgressPage } from "../../features/progress";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,

    children: [
      // ======================
      // Public Routes
      // ======================

      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "signup",
        element: <SignupPage />,
      },

      // ======================
      // Protected Routes
      // ======================

      {
        element: <ProtectedRoute />,

        children: [
          {
            element: <AppLayout />,

            children: [
              // Home
              {
                index: true,
                element: <HomePage />,
              },

              // Programs
              {
                path: "programs",

                children: [
                  {
                    index: true,
                    element: <ProgramsPage />,
                  },

                  {
                    path: ":programId",
                    element: <ProgramDetailsPage />,
                  },

                  {
                    path: ":programId/plans/:planId",
                    element: <PlanDetailsPage />,
                  },
                ],
              },

              // Workout
              {
                path: "workout",

                children: [
                  {
                    path: ":workoutId",
                    element: <WorkoutSessionPage />,
                  },

                  {
                    path: "history",
                    element: <WorkoutHistoryPage />,
                  },

                  {
                    path: "history/:workoutId",
                    element: <WorkoutDetailsPage />,
                  },
                ],
              },

              // Progress
              {
                path: "progress",
                element: <ProgressPage />,
              },

              // Profile
              {
                path: "profile",
                element: <ProfilePage />,
              },

              // App fallback
              {
                path: "*",
                element: <Navigate to="/" replace />,
              },
            ],
          },
        ],
      },
    ],
  },

  // Global fallback
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
