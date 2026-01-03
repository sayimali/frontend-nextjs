import { Button, Modal, Text } from "@mantine/core";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "@/utils/config";

interface DeleteSaleProps {
  opened: boolean;
  onClose: () => void;
  saleId: string;
  onDeleteSale: () => void;
}

const DeleteSale: React.FC<DeleteSaleProps> = ({ opened, onClose, saleId, onDeleteSale }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/saleperson/delete-sale/${saleId}`);
      onDeleteSale();
      toast.success("Salesperson deleted successfully!");
      onClose();
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast.error("Failed to delete salesperson. Please try again.");
    }
  };


  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Deletion"
      size="sm"
      yOffset="5vh"  // ✅ Moves the modal closer to the top
    >
      <Text size="md" mb="md">
        Are you sure you want to delete this salesperson?
      </Text>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <Button color="red" onClick={handleDelete}>Delete</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
};

export default DeleteSale;
