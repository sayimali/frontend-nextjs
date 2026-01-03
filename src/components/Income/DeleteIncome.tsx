import { Modal, Button, Text } from "@mantine/core";
import axios from "axios";
import API_BASE_URL from "@/utils/config";
import { useState } from "react";
import { toast } from "react-toastify";

interface DeleteIncomeProps {
  opened: boolean;
  onClose: () => void;
  onDeleteIncome: () => void;
  incomeId: string;
}

export const DeleteIncome: React.FC<DeleteIncomeProps> = ({
  opened,
  onClose,
  onDeleteIncome,
  incomeId,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!incomeId) return;

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/income/delete-income/${incomeId}`);
      toast.success("Income deleted successfully");
      onDeleteIncome(); // Refresh table
      onClose(); // Close modal
    } catch (error) {
      toast.error("Failed to delete income");
      console.error("Error deleting income:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Delete Income">
      <Text>Are you sure you want to delete this income record?</Text>
      <Button color="red" onClick={handleDelete} loading={loading} mt="md">
        Confirm Delete
      </Button>
    </Modal>
  );
};
