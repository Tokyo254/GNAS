import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {

Container,
Paper,
Typography,
TextField,
Button,
Box,
Alert,
} from '@mui/material';

const AdminSignUp: React.FC = () => {
const navigate = useNavigate();
const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
});
const [error, setError] = useState<string>('');

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    try {
        const response = await axios.post('/api/admin/signup', {
            username: formData.username,
            email: formData.email,
            password: formData.password,
        });

        if (response.data.success) {
            navigate('/admin/login');
        }
    } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred during signup');
    }
};

return (
    <Container maxWidth="sm">
        <Box sx={{ mt: 8, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Admin Sign Up
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Sign Up
                    </Button>
                </form>
            </Paper>
        </Box>
    </Container>
);
};

export default AdminSignUp;