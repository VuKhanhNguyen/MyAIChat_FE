import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import type { UserModel } from "./types";
import React from "react";
import "./App.css";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const userJson = localStorage.getItem("user");

  // Parse user if it exists, otherwise provide a fallback empty one
  // The layout actually defaults to dark theme preferences via types.
  const user: UserModel = userJson
    ? JSON.parse(userJson)
    : {
        id: "guest",
        name: "Guest",
        preferences: {
          theme: "dark",
          reducedMotion: false,
        },
      };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout user={user} />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
