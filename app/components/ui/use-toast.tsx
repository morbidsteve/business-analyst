import { createContext, useContext, useReducer } from "react"

interface Toast {
    id: string
    message: string
    type: "success" | "error" | "info" | "warning"
}

interface ToastState {
    toasts: Toast[]
}

type ToastAction = { type: "ADD_TOAST"; payload: Toast } | { type: "DISMISS_TOAST"; toastId?: string }

const initialState: ToastState = {
    toasts: [],
}

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [...state.toasts, action.payload],
            }
        case "DISMISS_TOAST":
            return {
                ...state,
                toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
            }
        default:
            return state
    }
}

const ToastContext = createContext<{
    state: ToastState
    toast: (message: string, type: "success" | "error" | "info" | "warning") => void
    dismiss: (toastId?: string) => void
}>({
    state: initialState,
    toast: () => {},
    dismiss: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(toastReducer, initialState)

    const toast = (message: string, type: "success" | "error" | "info" | "warning") => {
        const id = Math.random().toString(36).substring(2, 15)
        dispatch({ type: "ADD_TOAST", payload: { id, message, type } })
    }

    return (
        <ToastContext.Provider
            value={{
                state,
                toast,
                dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
            }}
        >
            {children}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }

    return {
        ...context.state,
        toast: context.toast,
        dismiss: context.dismiss,
    }
}

