import { Modal, Button, Text, Group } from "@mantine/core";
import axios from "axios";
import { toast } from "react-toastify";
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary

interface DeleteTechnicianProps {
  opened: boolean;
  onClose: () => void;
  technicianId: string | null;
  onDeleteTechnician: () => void;
}

const DeleteTechnician = ({ opened, onClose, technicianId, onDeleteTechnician }: DeleteTechnicianProps) => {
  const handleDelete = async () => {
    if (!technicianId) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/technician/delete-technician/${technicianId}`);
      onDeleteTechnician(); // Refresh data after deletion

      toast.success("Technician deleted successfully!");
      onClose(); // Close the pop-up
    } catch (err) {
      toast.error("Failed to delete technician");
      console.error("Error details:", err);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Deletion"
      yOffset="5vh" // Moves the modal closer to the top of the page
      withCloseButton
    >
      <Text>Are you sure you want to delete this technician?</Text>
      <Group justify="flex-end" mt="md">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button color="red" onClick={handleDelete}>Delete</Button>
      </Group>
    </Modal>
  );
};

export default DeleteTechnician;
