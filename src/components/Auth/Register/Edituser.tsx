"use client";

import { useState, useEffect } from "react";
import { Button, Drawer, TextInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary
import { User } from "./types"; // Make sure the User type is defined in your types file
import { toast } from "react-toastify"; // Import toast without the ToastContainer

interface EditUserProps {
  opened: boolean;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void; // Prop to handle the updated user data
  userData: User | null; // Current user data to edit
}

const EditUser: React.FC<EditUserProps> = ({ opened, onClose, onUpdateUser, userData }) => {
  const [loading, setLoading] = useState(false);

  // Initialize form with default values or values from userData
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      Mobile_1: "",
      Mobile_2: "",
      role: "user", // Default role to "user"
    },
  });

  // Update form values when userData changes
  useEffect(() => {
    if (userData) {
      form.setValues({
        username: userData.username || "",
        email: userData.email || "",
        Mobile_1: String(userData.Mobile_1) || "", // Ensure Mobile_1 is a string
        Mobile_2: String(userData.Mobile_2) || "", // Ensure Mobile_2 is a string
        role: userData.role || "user", // Default role to "user" if not specified
      });
    } else {
      form.reset(); // Reset the form if no userData is provided
    }
  }, [userData]);

	const handleSubmit = async (values: typeof form.values) => {
		setLoading(true);
		try {
			const updatedUserData = {
				...values,
				Mobile_1: Number(values.Mobile_1), // Convert to number
				Mobile_2: Number(values.Mobile_2), // Convert to number
			};

			if (userData) {
				const response = await axios.put(
					`${API_BASE_URL}/api/auth/update-user/${userData._id}`,
					updatedUserData
				);
				onUpdateUser(response.data.user); // Handle the updated user data
				toast.success("User updated successfully!");
				onClose();
			}
		} catch (error) {
			console.error("Error updating user:", error);
			toast.error("Failed to update user. Please try again.");
		} finally {
			setLoading(false);
		}
	};

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Edit User"
      padding="md"
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Username"
          required
          {...form.getInputProps("username")}
        />
        <TextInput label="Email" required {...form.getInputProps("email")} />
        <TextInput
          label="Mobile 1"
          required
          {...form.getInputProps("Mobile_1")}
        />
        <TextInput
          label="Mobile 2"
          required
          {...form.getInputProps("Mobile_2")}
        />
        <Select
          label="Role"
          data={[
            { value: "user", label: "User" },
            { value: "admin", label: "Admin" },
          ]}
          required
          {...form.getInputProps("role")}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <Button type="submit" loading={loading}>
            Update User
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

export default EditUser;
