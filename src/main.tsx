import { Suspense } from "react";
import ReactDOM from "react-dom/client";

import App from "@/App";
import Loading from "@/components/loading";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Suspense fallback={<Loading />}>
      <App />
      <Toaster />
    </Suspense>
  </ThemeProvider>
);
