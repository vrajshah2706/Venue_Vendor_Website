//context for showing toast at the bottom of the screen 
import { createContext, useContext, useState } from "react";
//changes based on what type you trying to show user 
type ToastType = "success" | "error" | "info";

type ToastContextType = {
    message: string;
    type: ToastType;
    showToast : (msg: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null > (null); 

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    //state for message
    const [message, setMessage] = useState("");
    const [type, setType] = useState<ToastType>("info"); 

    const showToast = (msg : string,  toastType: ToastType = "info" ) => {
        setMessage(msg);
        setType(toastType);

        //auto hide after 3 seconds
        setTimeout (() => {
            setMessage(""); 

        }, 3000);
        
    }

    return (
        <ToastContext.Provider value={{ message,type, showToast }}>
            {children}
        </ToastContext.Provider>
    );
    
}; 

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used inside ToastProvider");
    return context;
};