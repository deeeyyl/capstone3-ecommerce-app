import React, { useContext } from "react";
import CheckOrderUser from "../components/CheckOrderUser";
import ManageOrderAdmin from "../components/ManageOrderAdmin";
import UserContext from "../context/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

export default function OrderPage() {
  const { user } = useContext(UserContext);

  const renderView = () => {
    if (!user || !user.id) {
      return (
        <div className="text-center">
          <p>Please log in to view your orders.</p>
          <Link to="/login">
            <button className="btn btn-primary">Login</button>
          </Link>
        </div>
      );
    }

    if (user.isAdmin) {
      return <ManageOrderAdmin />;
    }

    return <CheckOrderUser />;
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      {renderView()}
    </div>
  );
}