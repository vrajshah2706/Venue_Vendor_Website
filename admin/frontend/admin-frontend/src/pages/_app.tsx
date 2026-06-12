import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "@/apolloClient";
import { AppProvider } from "@/appContext/AppContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AppProvider>
         <Component {...pageProps} />
      </AppProvider>
     
    </ApolloProvider>
  );
}
