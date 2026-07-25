import { StrictMode, Suspense } from "preact/compat";
import { render } from "preact";
import App from "./App.js";
import { DBContext } from "./context/DBContext.js";
import MessageStorageProvider from "./context/MessageStorageProvider.js";
import { PeerProvider } from "./context/PeerProvider.js";
import "./index.css";
import { RepoDB } from "./state/db.js";

const dbInstance = await RepoDB.init();

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

render(
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
  root,
);
