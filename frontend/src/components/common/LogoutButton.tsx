import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "components/common/LogoutButton.css";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button className="logout-button" onClick={() => logout({ returnTo: window.location.origin })}>
      Déconnexion
    </button>
  );
};

export default LogoutButton;