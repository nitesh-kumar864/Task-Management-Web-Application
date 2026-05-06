import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL + "/auth";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  // ---------------- SIGNUP ----------------
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/signup`,
        { email, password, name },
        { withCredentials: true }
      );

      set({
        user: response.data.user,
        isAuthenticated: false,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  // ---------------- LOGIN ----------------
login: async (email, password) => {
  set({ isLoading: true, error: null });

  try {
    await axios.post(
      `${API_URL}/login`,
      { email, password },
      { withCredentials: true }
    );

    const authResponse = await axios.get(
      `${API_URL}/check-auth`,
      { withCredentials: true }
    );

    set({
      user: authResponse.data.user,
      isAuthenticated: true,
      isLoading: false,
    });

  } catch (error) {
    set({
      error: error?.response?.data?.message || "Login failed",
      isLoading: false,
    });

    throw error;
  }
},

//  ---------------- Logout ----------------

logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

  // ---------------- VERIFY EMAIL ----------------
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/verify-email`,
        { code },
        { withCredentials: true }
      );

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  // ---------------- CHECK AUTH ----------------
checkAuth: async () => {
  set({ isCheckingAuth: true });

  try {
    const response = await axios.get(`${API_URL}/check-auth`);

    set({
      user: response.data.user,
      isAuthenticated: true,
      isCheckingAuth: false,
    });
  } catch (error) {
    set({
      user: null,
      isAuthenticated: false,
      isCheckingAuth: false,
    });
  }
},

	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},

  	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));
