"use client";

import { Button, Drawer, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify"; // Import toast from react-toastify
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary

// Define an interface for the category data
interface CategoryData {
  _id: string;
  CategoryExpanse: string;
}

// Define the props interface for the EditCategory component
interface EditCategoryProps {
  opened: boolean;
  onClose: () => void;
  onUpdateCategory: (updatedCategory: CategoryData) => void;
  categoryData: CategoryData | null; // Use null to handle when no category is selected
}

const EditCategory: React.FC<EditCategoryProps> = ({
  opened,
  onClose,
  onUpdateCategory,
  categoryData,
}) => {
  // Initialize the form with useForm
  const form = useForm({
    initialValues: {
      CategoryExpanse: '',
    },
  });

  // Update the form values when categoryData changes
  useEffect(() => {
    if (categoryData) {
      form.setValues({
        CategoryExpanse: categoryData.CategoryExpanse,
      });
    } else {
      form.reset(); // Reset form if no category data
    }
  }, [categoryData]); // Re-run this effect when categoryData changes

  const handleSubmit = async (values: { CategoryExpanse: string }) => {
    // Check if categoryData is available and has an ID
    if (!categoryData || !categoryData._id) {
      console.error("Cannot update category: no category data found.");
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/api/expanse/update-Category/${categoryData._id}`, values);

      if (response.status === 200) { // Check if the update was successful
        onUpdateCategory({ ...categoryData, CategoryExpanse: values.CategoryExpanse }); // Update category data in the state
        toast.success("Category updated successfully!"); // Show success notification
        onClose();
      } else {
        console.error("Failed to update category:", response.data);
        toast.error("Failed to update category. Please try again."); // Show error notification
      }
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Failed to update category. Please try again."); // Show error notification
    }
  };

  return (
    <Drawer opened={opened} onClose={onClose} title="Edit Category">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Category Name"
          {...form.getInputProps("CategoryExpanse")}
        />
        <Button type="submit" mt="md">Update Category</Button>
      </form>
    </Drawer>
  );
};

export default EditCategory;
