import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/tasks";

export const useTaskStore = create((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  // ---------------- GET TASKS ----------------
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(API_URL, {
        withCredentials: true,
      });

      set({ tasks: res.data.tasks, isLoading: false });
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Error fetching tasks",
        isLoading: false,
      });
    }
  },

  // ---------------- CREATE TASK ----------------
  addTask: async (data) => {
    try {
      const res = await axios.post(API_URL, data, {
        withCredentials: true,
      });

      set((state) => ({
        tasks: [res.data.task, ...state.tasks],
      }));
    } catch (error) {
      console.log(error);
    }
  },

  // ---------------- DELETE TASK ----------------
  deleteTask: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });

      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
      }));
    } catch (error) {
      console.log(error);
    }
  },

  // ---------------- updae TASK ----------------
  updateTask: async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data, {
        withCredentials: true,
      });

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? res.data.task : task
        ),
      }));
    } catch (error) {
      console.log(error);
    }
  },

  // ---------------- TOGGLE TASK ----------------
  toggleTask: async (id) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}/toggle`, {}, {
        withCredentials: true,
      });

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? res.data.task : task
        ),
      }));
    } catch (error) {
      console.log(error);
    }
  },
}));