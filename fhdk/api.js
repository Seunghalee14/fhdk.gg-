import axios from "axios";

export const baseURL = "https://api.fhdk.gg"

const API = axios.create({
  baseURL,
  withCredentials: true,
});

export default API;
