"use client";

import { Button, Modal, Text } from "@mantine/core";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast from react-toastify
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary

type DeleteUserModalProps = {
  opened: boolean;
  onClose: () => void;
  userId: string;
  onDeleteUser: () => void; // Function to refresh the user data
};

const DeleteUserModal = ({ opened, onClose, userId, onDeleteUser }: DeleteUserModalProps) => {
  const handleDelete = async () => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    try {
      // Make DELETE request to your API
      const response = await axios.delete(
        `${API_BASE_URL}/api/auth/delete-user/${userId}`
      );

      if (response.status === 200) {
        // If the deletion was successful, show a success toast
        toast.success("User deleted successfully!");
        onDeleteUser(); // Refresh the user data
        onClose(); // Close the modal
      } else {
        console.error("Failed to delete user. Server responded with:", response.status);
        toast.error("Failed to delete user. Please try again."); // Show an error toast
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("An error occurred while deleting the user. Please try again."); // Show an error toast
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Delete User">
      <Text>Are you sure you want to delete this user?</Text>
      <Button color="red" onClick={handleDelete} style={{ marginTop: "16px" }}>
        Yes, Delete
      </Button>
    </Modal>
  );
};

export default DeleteUserModal;
