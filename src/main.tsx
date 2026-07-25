import { StrictMode, Suspense } from "preact/compat";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { DBContext } from "./context/DBContext.js";
import { PeerProvider } from "./context/PeerProvider.js";
import "./index.css";
import { RepoDB } from "./state/db.js";
import MessageStorageProvider from "./context/MessageStorageProvider.js";

const dbInstance = await RepoDB.init();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback="Loading...">
      <DBContext.Provider value={dbInstance}>
        <MessageStorageProvider>
          <PeerProvider>
            <App />
          </PeerProvider>
        </MessageStorageProvider>
      </DBContext.Provider>
    </Suspense>
  </StrictMode>,
);
