// src/features/auth/services/authService.js

import { supabase } from "../../../config/supabase";

// ----------------------
// Login with email and password
// ----------------------

export const loginUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return {
    user: data.user,
    session: data.session,
  };
};

// ----------------------
// Login with google
// ----------------------

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    throw error;
  }

  return data;
};
// ----------------------
// Register
// ----------------------

export const registerUser = async ({ email, password, full_name }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,

    options: {
      data: {
        full_name,
      },
    },
  });

  if (error) {
    throw error;
  }

  return {
    user: data.user,
    session: data.session,
  };
};

// ----------------------
// Current Auth User
// ----------------------

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw error;
  }

  return user;
};

// ----------------------
// User + Profile
// ----------------------

export const getUserProfile = async () => {
  const user = await getCurrentUser();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return {
    ...user,
    profile: profile ?? null,
  };
};

// ----------------------
// Logout
// ----------------------

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  return {
    success: true,
  };
};
