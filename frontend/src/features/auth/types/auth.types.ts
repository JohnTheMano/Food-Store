
export interface UsuarioAuth {
    id: number
    username: string
    full_name: string
    email: string
    role: 'user' | 'admin'
    disabled: boolean
    created_at: string
}

export interface LoginCredentials {
    username: string
    password: string
}

export interface RegisterData {
    username: string
    full_name: string
    email: string
    password: string
}

export interface AuthStoreState {
    user: UsuarioAuth | null
    status: 'checking' | 'authenticated' | 'unauthenticated'
    login: (username: string, password: string) => Promise<void>
    logout: () => Promise<void>
    checkSession: () => Promise<void>
}
