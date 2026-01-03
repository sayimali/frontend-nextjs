import { Button, Modal } from "@mantine/core";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast from react-toastify
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary

// Define an interface for the props of the DeleteCategory component
interface DeleteCategoryProps {
  opened: boolean;
  onClose: () => void;
  categoryId: string; // The ID of the category to delete
  onDeleteCategory: () => void; // Callback function to refresh the category list or handle deletion
}

const DeleteCategory: React.FC<DeleteCategoryProps> = ({ opened, onClose, categoryId, onDeleteCategory }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/expanse/delete-category/${categoryId}`);
      onDeleteCategory(); // Call the function to refresh or update the state
      toast.success("Category deleted successfully!"); // Show success notification
      onClose(); // Close the modal after deletion
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category. Please try again."); // Show error notification
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Delete Category">
      <div>Are you sure you want to delete this category?</div>
      <Button color="red" onClick={handleDelete} mt="md">Delete</Button>
    </Modal>
  );
};

export default DeleteCategory;
