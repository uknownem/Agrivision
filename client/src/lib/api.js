import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach Supabase Token or Demo Token to authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("agri_token") || "demo-token";
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  syncSession: async () => {
    const res = await api.post("/auth/sync");
    return res.data;
  }
};

export const fieldsApi = {
  getAll: async () => {
    const res = await api.get("/fields");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/fields/${id}`);
    return res.data;
  },
  create: async (fieldData) => {
    const res = await api.post("/fields", fieldData);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/fields/${id}`);
    return res.data;
  }
};

export const advisoryApi = {
  generate: async (payload) => {
    const res = await api.post("/advisory/generate", payload);
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/advisory/${id}`);
    return res.data;
  },
  getByField: async (fieldId) => {
    const res = await api.get(`/advisory/field/${fieldId}`);
    return res.data;
  }
};

export const diagnosticsApi = {
  scan: async (formData) => {
    const res = await api.post("/diagnostics/scan", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  }
};
