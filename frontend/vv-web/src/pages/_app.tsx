import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastProvider } from "@/context/ToastContext";
import { Toast } from "@/components/toast";
import { AppProvider } from "@/context/AppContext";

export default function App({ Component, pageProps }: AppProps) {
  return ( 
    //wrapping ToastProvider globally so
    //every component/pages will have access to context
    <ToastProvider>
      <AppProvider>
          <Toast />
          <Component {...pageProps} />
        </AppProvider>
    </ToastProvider>
  
  );
}
