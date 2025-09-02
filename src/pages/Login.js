import { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2"

import UserContext from "../context/UserContext";

export default function Login() {

	const {user, setUser} = useContext(UserContext);

	// State hooks to store the values of the input fields
	const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // State to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(true);
	const [loading, setLoading] = useState(false);
    
	function authenticate(e) {

        // Prevents page redirection via form submission
        e.preventDefault();
		setLoading(true);
		fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({

				email: email,
				password: password

			})
		})
		.then(res => res.json())
		.then(data => {

			// access: token
			if(data.access){

				// Set the token of the authenticated user in the local storage
	        	// Syntax
	        	// localStorage.setItem('propertyName', value);
	        						//(key , value)
				localStorage.setItem('token', data.access);
				retrieveUserDetails(data.access);

				// Clear input fields after submission
				setEmail('');
				setPassword('');

				Swal.fire({
					icon: 'success',
					title: 'Logged In',
					text: 'You are now logged in!',
					timer: 2000,
					showConfirmButton: false
				});
			
			} else if (data.message === "Incorrect email or password") {
				Swal.fire({
					icon: 'error',
					title: 'Login Failed',
					text: 'Incorrect email or password.'
				});

			} else {
				Swal.fire({
					icon: 'error',
					title: 'User Not Found',
					text: `${email} does not exist.`
				});
			}
			});
		}

    function retrieveUserDetails(token){
    	fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
    		headers:{
    			Authorization: `Bearer ${token}`
    		}
    	})
    	.then(res => {
    		return res.json()
    	})
    	.then(data => {

    		// console.log(data);

    		setUser({
    			id: data._id,
    			isAdmin: data.isAdmin
    		}) 
    	})
    }


	useEffect(() => {
        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }
    }, [email, password]);
		if (user && user.id) {
		return <Navigate to="/home" />;
	}

    return (
    	(user && user.id !== null) ?
    		<Navigate to="/home" />
    		:
			
	        <Form onSubmit={(e) => authenticate(e)}>
	        	<h1 className="my-5 text-center page-title">Login</h1>
	            <Form.Group>
	                <Form.Label>Email address</Form.Label>
	                <Form.Control 
	                    type="email" 
	                    placeholder="Enter email" 
	                    required
	                    value={email}
	        			onChange={(e) => setEmail(e.target.value)}
	                />
	            </Form.Group>

	            <Form.Group className="mb-3">
	                <Form.Label>Password</Form.Label>
	                <Form.Control 
	                    type="password" 
	                    placeholder="Password" 
	                    required
	                    value={password}
	        			onChange={(e) => setPassword(e.target.value)}
	                />
	            </Form.Group>

	            { isActive ? 
	                <Button variant="primary" type="submit" id="loginBtn">
	                    Login
	                </Button>
	                : 
	                <Button variant="danger" type="submit" id="loginBtn" disabled>
	                    Login
	                </Button>
	            }
        	</Form>       
    )
}