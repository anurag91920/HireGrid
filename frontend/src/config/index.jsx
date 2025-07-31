import axios from "axios";

// Axios client setup
export const clientServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CLIENT_SERVER_URL,
});

// Image and API base URLs
export const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;