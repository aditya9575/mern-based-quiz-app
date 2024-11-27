import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import styles from './loginform.module.css';
import { useNavigate } from 'react-router-dom';
import { GiBookStorm } from "react-icons/gi";

import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const LoginForm = ({ setAuth }) => {
    const [formData, setFormData] = useState({
        email: '',
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

        if (!formData.email || !formData.password) {
            setError('Please fill in both email and password.');
            return;
        }

        try {
            const response = await axios.post('https://mern-based-quiz-app.vercel.app/login', formData);
            setMessage(response.data.message);

            // Save token and name to localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('name', response.data.name);

            setAuth(true); // Notify App of authentication

            navigate('/home'); // Redirect to home page on success
        } catch (err) {
            setError(err.response?.data?.error || 'Server error. Please try again.');
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse?.credential);
            const { name, email } = decoded;

            const response = await axios.post('https://mern-based-quiz-app.vercel.app/google-login', {
                name,
                email,
                googleId: decoded.sub,
            });

            setMessage(response.data.message);

            // Save token and name to localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('name', response.data.name);

            setAuth(true); // Notify App of authentication

            navigate('/home'); // Redirect to home page on success
        } catch (err) {
            setError(err.response?.data?.error || 'Server error. Please try again.');
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
                        Log In
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
                    <span>Don't have an account? </span>
                    <Button variant="link" onClick={() => navigate('/signup')}>
                        Sign up here
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
