import { StrictMode, Suspense } from "preact/compat";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { DBContext } from "./context/DBContext.js";
import { PeerProvider } from "./context/PeerProvider.js";
import "./index.css";
import { RepoDB } from "./state/db.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MessageStorageProvider from "./context/MessageStorageProvider.js";

const dbInstance = await RepoDB.init();
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback="Loading...">
      <DBContext.Provider value={dbInstance}>
        <QueryClientProvider client={queryClient}>
          <MessageStorageProvider>
            <PeerProvider>
              <App />
            </PeerProvider>
          </MessageStorageProvider>
        </QueryClientProvider>
      </DBContext.Provider>
    </Suspense>
  </StrictMode>,
);
