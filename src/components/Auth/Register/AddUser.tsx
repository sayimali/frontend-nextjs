"use client";

import { useState } from "react";
import { Drawer, Button, TextInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary


type AddUserProps = {
  opened: boolean;
  onClose: () => void;
  onAddUser: (newUser: any) => void;
};

const AddUser = ({ opened, onClose, onAddUser }: AddUserProps) => {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      Mobile_1: "",
      Mobile_2: "",
      password: "",
      role: "user",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      Mobile_1: (value) => (value.trim() ? null : "Mobile 1 is required"),
      Mobile_2: (value) => (value.trim() ? null : "Mobile 2 is required"),
      password: (value) => (value.length >= 6 ? null : "Password must be at least 6 characters"),
    },
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, values);

      // Ensure the new user data includes all necessary fields
      const newUser = {
        ...response.data,
        rowNumber: 0, // Will be recalculated when added to the table
      };

      onAddUser(newUser);
      onClose();
    } catch (err) {
      console.error("Failed to add user:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer opened={opened} onClose={onClose} title="Add User">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Username" {...form.getInputProps("username")} required />
        <TextInput label="Email" {...form.getInputProps("email")} required />
        <TextInput label="Mobile 1" {...form.getInputProps("Mobile_1")} required />
        <TextInput label="Mobile 2" {...form.getInputProps("Mobile_2")} required />
        <TextInput label="Password" type="password" {...form.getInputProps("password")} required />
        <Select
          label="Role"
          data={[{ value: "user", label: "User" }, { value: "admin", label: "Admin" }]}
          {...form.getInputProps("role")}
          required
        />
        <Button type="submit" loading={loading} fullWidth mt="md">
          Add User
        </Button>
      </form>
    </Drawer>
  );
};

export default AddUser;
