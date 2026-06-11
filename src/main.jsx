import React from "react";
import { AppRegistry } from "react-native";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./web.css";

AppRegistry.registerComponent("GICCHomepage", () => App);

const root = createRoot(document.getElementById("root"));
root.render(<App />);
