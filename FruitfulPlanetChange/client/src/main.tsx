import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🚀 main.tsx loading");

const container = document.getElementById("root");
if (!container) {
  console.error("❌ Failed to find root element");
  throw new Error("Failed to find the root element");
}

console.log("✅ Root element found, creating React root");
const root = createRoot(container);

console.log("🎯 Rendering App component");
root.render(<App />);
