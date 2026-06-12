import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api", // Adjust this to match your backend URL
});

export default api; 