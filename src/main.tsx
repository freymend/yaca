import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { DBContext } from "./context/DBContext.js";
import { PeerProvider } from "./context/PeerProvider.js";
import "./index.css";
import { RepoDB } from "./state/db.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const dbInstance = await RepoDB.init();
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DBContext value={dbInstance}>
      <QueryClientProvider client={queryClient}>
        <PeerProvider>
          <Suspense fallback="Loading...">
            <App />
          </Suspense>
        </PeerProvider>
      </QueryClientProvider>
    </DBContext>
  </StrictMode>,
);
