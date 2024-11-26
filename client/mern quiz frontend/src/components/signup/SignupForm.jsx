import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import styles from './signupform.module.css';
import { useNavigate } from 'react-router-dom';
import { GiBookStorm } from "react-icons/gi";

import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from "jwt-decode";

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        email: '',
        phoneNumber: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Simple validation
        if (!formData.name || !formData.age || !formData.email || !formData.phoneNumber || !formData.password) {
            setError('Please fill in all fields.');
            return;
        }

        setError('');

        try {
            // Sending POST request to backend for signup
            const response = await axios.post('http://localhost:5000/signup', formData);
            setMessage(response.data.message); // Response from backend (e.g., success message)
            setTimeout(() => {
                navigate('/login'); // Redirect to login after successful signup
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Server error. Please try again.');
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            // Decode the JWT token
            const decoded = jwtDecode(credentialResponse?.credential);

            // Destructure `name` and `email`
            const { name, email } = decoded;

            console.log("Decoded Token:", decoded); // For debugging
            console.log("Name:", name, "Email:", email);
            console.log(decoded.sub)

            // Send `name` and `email` to the backend
            const response = await axios.post('http://localhost:5000/google-login', {
                name,
                email,
                googleId: decoded.sub, // Include Google ID (sub) if necessary
            });

            // Log the backend response
            console.log("Backend Response:", response.data);

            setMessage(response.data.message); // Login success message
            localStorage.setItem('token', response.data.token); // Save token to localStorage for further requests
            navigate('/home');
        } catch (error) {
            console.error("Error during Google login:", error);
            alert('Login failed. Please try again.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles["form-container"]}>
                <div className={styles.logo}>
                    Quizzy <GiBookStorm />
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formAge">
                        <Form.Control
                            type="number"
                            placeholder="Enter your age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPhone">
                        <Form.Control
                            type="text"
                            placeholder="Enter your phone number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Sign Up
                    </Button>
                </Form>
                <div className="text-center mt-3">
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => {
                            console.error("Login Failed");
                            alert("Google login failed. Please try again.");
                        }}
                    />
                    <span>Already have an account? </span>
                    <Button variant="link" onClick={() => navigate('/login')}>
                        Log in here
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
