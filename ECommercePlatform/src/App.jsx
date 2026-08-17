import { useState } from "react";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  if (user !== null) {
    return <Dashboard user={user} onLogout={() => setUser(null)} />;
  }

  if (showRegister === true) {
    return <Register onNavigateToLogin={() => setShowRegister(false)} />;
  }

  return (
    <Login
      onLoginSuccess={setUser}
      onNavigateToRegister={() => setShowRegister(true)}
    />
  );
}