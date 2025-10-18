console.log("=== MAIN.TSX LOADING ===");
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("=== MAIN.TSX: Imports successful ===");
console.log("=== MAIN.TSX: Creating root ===");
const rootElement = document.getElementById("root");
console.log("=== MAIN.TSX: Root element:", rootElement);

if (!rootElement) {
  console.error("=== MAIN.TSX: Root element not found! ===");
} else {
  try {
    console.log("=== MAIN.TSX: Rendering App ===");
    createRoot(rootElement).render(<App />);
    console.log("=== MAIN.TSX: App rendered successfully ===");
  } catch (error) {
    console.error("=== MAIN.TSX: Error rendering App ===", error);
  }
}
