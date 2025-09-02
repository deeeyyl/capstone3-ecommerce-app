import { useState, useContext, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function Register() {
  const { user } = useContext(UserContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isActive, setIsActive] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
   const [loading, setLoading] = useState(false);

  function registerUser(e) {
    e.preventDefault();
     setLoading(true);

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNo: mobileNo,
        password: password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "User registered successfully") {
          setFirstName("");
          setLastName("");
          setEmail("");
          setMobileNo(0);
          setPassword("");
          setConfirmPassword("");

          Swal.fire({
            title: "Success",
            icon: "success",
            text: data.message
          });

          setRegisterSuccess(true); 
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: data.message
          });
        }
      });
  }

  useEffect(() => {
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      mobileNo !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

  if (user !== null || registerSuccess) {
    return <Navigate to="/login" />;
  }

  return (
    <Form onSubmit={e => registerUser(e)}>
      <h1 className="my-5 text-center page-title">Register</h1>

      <Form.Group>
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Mobile Number</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter Mobile No"
          value={mobileNo}
          onChange={e => setMobileNo(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
      </Form.Group>

      <div className="d-grid gap-2">
        <Button variant="primary" type="submit" disabled={!isActive}>
          Register
        </Button>
      </div>
    </Form>
  );
}