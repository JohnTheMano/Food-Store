import axiosInstance from './axiosInstance'
import { useNotificationStore } from '@/store/notificationStore'

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    if (status === 403) {
      useNotificationStore.getState().showNotification('Acceso denegado')
    }

    return Promise.reject(error)
  },
)
