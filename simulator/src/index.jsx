import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Desk from "./components/Desk";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Desk />
    </StrictMode>,
);
