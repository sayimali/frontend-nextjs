"use client";

import React, { useState } from "react";
import axios from "axios";
import { useForm } from "@mantine/form";
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Paper,
  Title,
  Text,
} from "@mantine/core";

// API utility
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`, // Corrected base URL
  withCredentials: true,
});

const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("authToken", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("authToken");
  }
};

// LoginPage Component
const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mantine form handling
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) => (value.trim() ? null : "Username is required"),
      password: (value) =>
        value.length > 5 ? null : "Password must be at least 6 characters long",
    },
  });

  // Handle form submission
  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      // Make login request
      const response = await api.post("/login", values);

      // Check if the token is in the response
      const token = response.data.token;
      if (token) {
        setAuthToken(token); // Store token in localStorage

        window.location.href = "/dashboard"; // Redirect to dashboard
      } else {
        throw new Error("No token received");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ||
          "Login failed. Please check your username and password.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundImage: 'url(ACC.png)', // Adjust image path as needed
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh', // Ensures the background covers the entire screen height
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px', // Ensures padding around the content
    }}>
      <Container size={420} my={40} style={{
        maxWidth: '100%', // Prevents the container from exceeding the viewport width
        padding: '20px', // Adjust the padding inside the container
        background: 'rgba(255, 255, 255, 0.8)', // Light background to make form more readable
        borderRadius: '8px', // Smooth corners for the form
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Adds a slight shadow for a nice effect
      }}>
        <Title style={{ textAlign: "center" }}>Login</Title>
        <Text color="dimmed" size="sm" style={{ textAlign: "center" }} mt={5}>
          Please enter your credentials to log in
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Username"
              placeholder="Your username"
              {...form.getInputProps("username")}
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              {...form.getInputProps("password")}
              required
              mt="sm"
            />
            {error && (
              <Text color="red" size="sm" mt="sm">
                {error}
              </Text>
            )}
            <Button type="submit" fullWidth mt="xl" loading={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default LoginPage;
