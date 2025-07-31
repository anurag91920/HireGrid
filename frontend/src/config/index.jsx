import axios from "axios";

// Create axios client using env variable
export const clientServer = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Image URL base
export const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
// Default headers for the axios client
clientServer.defaults.headers.common["Content-Type"] = "application/json";