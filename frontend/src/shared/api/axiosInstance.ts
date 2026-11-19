
import axios from "axios"

let unauthorizedHandler: (() => void) | undefined

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        const status = axios.isAxiosError(error) ? error.response?.status : undefined
        const url = axios.isAxiosError(error) ? error.config?.url ?? '' : ''
        const isAuthRequest = url.includes('/auth/token') || url.includes('/auth/me')

        if (status === 401 && !isAuthRequest) {
            unauthorizedHandler?.()
        }

        return Promise.reject(error)
    },
)

export function setUnauthorizedHandler(handler: () => void) {
    unauthorizedHandler = handler
}

export default axiosInstance
