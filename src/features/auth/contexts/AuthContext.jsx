// src/features/auth/contexts/AuthContext.jsx

import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getUserProfile,
  loginUser,
  signInWithGoogle,
  logoutUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

const USER_QUERY_KEY = ["user"];

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // -------------------------
  // Current User
  // -------------------------

  const {
    data: user = null,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: getUserProfile,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // -------------------------
  // Login
  // -------------------------

  const loginMutation = useMutation({
    mutationFn: loginUser,

    onSuccess: ({ user }) => {
      queryClient.setQueryData(USER_QUERY_KEY, user);
    },
  });

  // -------------------------
  // Google Login
  // -------------------------

  const googleSignInMutation = useMutation({
    mutationFn: signInWithGoogle,
  });

  // -------------------------
  // Register
  // -------------------------

  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: ({ user, session }) => {
      if (session) {
        queryClient.setQueryData(USER_QUERY_KEY, user);
      }
    },
  });

  // -------------------------
  // Logout
  // -------------------------

  const logoutMutation = useMutation({
    mutationFn: logoutUser,

    onSettled: () => {
      queryClient.setQueryData(USER_QUERY_KEY, null);
    },
  });

  // -------------------------
  // Context Value
  // -------------------------

  const value = {
    user,
    isAuthenticated: Boolean(user),

    // Loading states
    isLoadingUser,
    isLoggingIn: loginMutation.isPending,
    isGoogleSignIn: googleSignInMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    // Errors
    userError,
    loginError: loginMutation.error,
    signInWithGoogleError: googleSignInMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,

    // Actions
    login: loginMutation.mutate,
    signInWithGoogle: googleSignInMutation.mutate,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
