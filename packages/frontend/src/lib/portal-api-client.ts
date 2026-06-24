import axios from 'axios';
import { toast } from 'sonner';

// Klien API terpisah untuk Vendor Portal — memakai token supplier sendiri,
// tidak mengirim X-Branch-Id (supplier tidak terikat cabang).
const portalApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

portalApiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('supplierAccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

portalApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supplierAccessToken');
        window.location.href = '/portal/login';
      }
    } else {
      const message = error.response?.data?.message || 'Terjadi kesalahan';
      toast.error(message);
    }
    return Promise.reject(error);
  },
);

export default portalApiClient;
