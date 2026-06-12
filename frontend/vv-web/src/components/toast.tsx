import { useToast } from "@/context/ToastContext";

//toast ui declaration 
export function Toast() {
    const {message, type} = useToast(); 
    if (!message) return null;

    return (
        <div className="fixed bottom-6 right-6  bg-white text-gray-800 px-5 py-3 rounded-xl shadow-xl border flex items-center gap-2 animate-fadeIn z-[10000]">
            {/*icons based on type */}
            {type === "success" && <span className="text-green-500">✔</span>}
            {type === "error" && <span className="text-red-500">✖</span>}
            {type === "info" && <span className="text-gray-500">ℹ</span>}
           
            <span>{message}</span>
        </div>
    );
}