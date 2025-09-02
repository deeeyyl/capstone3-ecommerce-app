import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <- this will fix the refresh bug

  const fetchUserDetails = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          setUser({
            id: data._id,
            isAdmin: data.isAdmin,
            likedProducts: data.likedProducts || [],
            // add other user fields here if needed
          });
        } else {
          setUser(null);
          localStorage.removeItem("token");
        }
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("token");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;