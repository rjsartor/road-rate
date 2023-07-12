import React from "react";
import { ModalProvider } from 'react-modal-hook';
import { App } from "./components/App";
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById("root"));
root.render(
    <ModalProvider>
        <App />
    </ModalProvider>
);