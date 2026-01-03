"use client";

import { Button, Drawer, Title } from "@mantine/core";
import axios from "axios";
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary

interface DeleteExpanseProps {
  opened: boolean;
  onClose: () => void;
  expanseId: string;
  onDeleteExpanse: () => void;
}

export const DeleteExpanse = ({ opened, onClose, expanseId, onDeleteExpanse }: DeleteExpanseProps) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/expanse/delete-Expanse/${expanseId}`);
      onDeleteExpanse(); // Refresh the data
      onClose(); // Close the drawer
    } catch (error) {
      console.error("Error deleting expanse:", error);
    }
  };

  return (
    <Drawer opened={opened} onClose={onClose} title="Delete Expanse" padding="xl" size="sm">
      <Title order={5}>Are you sure you want to delete this expanse?</Title>
      <Button color="red" onClick={handleDelete} mt="md">Delete</Button>
      <Button onClick={onClose} mt="md">Cancel</Button>
    </Drawer>
  );
};
