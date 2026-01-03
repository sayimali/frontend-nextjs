"use client";

import { Button, Drawer, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast from react-toastify
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary

// Define an interface for the props of the AddCategory component
interface AddCategoryProps {
  opened: boolean;
  onClose: () => void;
  onAddCategory: (newCategory: { _id: string; CategoryExpanse: string }) => void; // Adjust based on the response structure
}

const AddCategory: React.FC<AddCategoryProps> = ({ opened, onClose, onAddCategory }) => {
  const form = useForm({
    initialValues: {
      CategoryExpanse: '',
    },
    validate: {
      CategoryExpanse: (value) => (value.trim().length > 0 ? null : 'Category name cannot be empty'), // Validation rule
    },
  });

  const handleSubmit = async (values: { CategoryExpanse: string }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/expanse/create-Category`, values);
      onAddCategory(response.data.Category); // Ensure this matches your backend response
      form.reset(); // Reset the form fields after submission
      onClose();
      toast.success("Category added successfully!"); // Show success notification
    } catch (error) {
      console.error("Failed to add category:", error);
      toast.error("Failed to add category. Please try again."); // Show error notification
    }
  };

  return (
    <Drawer opened={opened} onClose={onClose} title="Add New Category">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Category Name"
          placeholder="Enter Name"
          {...form.getInputProps("CategoryExpanse")}
          error={form.errors.CategoryExpanse} // Display the validation error message
        />
        <Button type="submit" mt="md">Add Category</Button>
      </form>
    </Drawer>
  );
};

export default AddCategory;
