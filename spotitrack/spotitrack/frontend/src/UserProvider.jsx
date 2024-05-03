import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Attempt to retrieve existing user data from localStorage
    const savedUserData = localStorage.getItem("userData");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  /*Login function for user state*/
  const login = (userData) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    startTokenRefreshCycle();
    setUser(userData);
  };

  // logout function not working properly.
  const logout = useCallback(async () => {
    try {
      // Call to backend API to logout the user
      const response = await fetch("/users/api/logout", { method: "GET" });
      const data = await response.json();
      if (response.ok) {
        console.log("Logged out successfully", data);
        localStorage.removeItem("userData");
        // Clear user context after successful logout
        setUser(null);
        // Additional logic on logout success
      } else {
        throw new Error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (user && user.refresh_token) {
      try {
        const response = await fetch("/users/api/refresh");
        const data = await response.json();
        if (response.ok) {
          console.log("Token refreshed successfully", data);
          setUser((prev) => ({
            ...prev,
            access_token: data.access_token,
            refresh_token: data.refresh_token || prev.refresh_token,
          }));
          localStorage.setItem(
            "userData",
            JSON.stringify({
              ...user,
              access_token: data.access_token,
              refresh_token: data.refresh_token || user.refresh_token,
            })
          );
        } else {
          console.error("Failed to refresh access token");
        }
      } catch (error) {
        console.error("Error refreshing access token:", error);
      }
    }
  }, [user]);

  const startTokenRefreshCycle = useCallback(() => {
    const interval = 1000 * 60 * 50; // 59 minutes
    const intervalId = setInterval(refreshAccessToken, interval);
    return () => clearInterval(intervalId);
  }, [refreshAccessToken]);

  useEffect(() => {
    const intervalId = user ? startTokenRefreshCycle() : null;
    return () => intervalId && clearInterval(intervalId);
  }, [user, startTokenRefreshCycle]);

  return (
    <UserContext.Provider
      value={{ user, login, logout, startTokenRefreshCycle }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
