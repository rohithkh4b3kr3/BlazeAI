import axios from "axios";
import { API_BASE } from "./config";

export function get(url, opts = {}) {
  return axios.get(`${API_BASE}${url}`, { timeout: 15000, ...opts });
}

export function post(url, data, opts = {}) {
  return axios.post(`${API_BASE}${url}`, data, {
    timeout: 30000,
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
  });
}

export function postFormData(url, formData, opts = {}) {
  return axios.post(`${API_BASE}${url}`, formData, {
    timeout: 60000,
    headers: { "Content-Type": "multipart/form-data", ...opts.headers },
    ...opts,
  });
}

export { API_BASE };
