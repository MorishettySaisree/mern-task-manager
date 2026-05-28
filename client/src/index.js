import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

import Dashboard from "./pages/Dashboard.js";
import Login from "./pages/login.js";
import Register from "./pages/register.js";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/register"
        element={<Register />}
      />
    </Routes>
  </BrowserRouter>
);