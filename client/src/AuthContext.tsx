import React, {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from 'react'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
}

type AuthAction =
  | { type: 'LOGIN'; payload: { token: string } }
  | { type: 'LOGOUT' }

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
}

const AuthContext = createContext<{
  state: AuthState
  dispatch: Dispatch<AuthAction>
}>({
  state: initialState,
  dispatch: () => null,
})

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
      }
    case 'LOGOUT':
      document.cookie = 'jwtToken=undefined;'
      return {
        ...state,
        isAuthenticated: false,
        token: null,
      }
    default:
      return state
  }
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
