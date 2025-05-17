import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // You can expose decoded user data if needed

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Optional: check if token is expired
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          setIsAuthenticated(false);
          setUser(null);
          cookies.remove("token", { path: "/" }); // optional cleanup
        } else {
          setIsAuthenticated(true);
          setUser(decoded);
        }
      } catch (error) {
        console.error("Invalid token", error);
        setIsAuthenticated(false);
        setUser(null);
        cookies.remove("token", { path: "/" });
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  return { isAuthenticated, user };
}
