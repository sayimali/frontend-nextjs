"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Paper, Space, Title, Button } from "@mantine/core";
import { type MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary
import axios from "axios";
import AddCategory from "./AddCategory"; // Component to add a new category
import EditCategory from "./EditCategory"; // Component to edit a category
import DeleteCategory from "./DeleteCategory"; // Component to delete a category
import { Category } from "./types"; // Define the types for the category

export const CategoryExpanse = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDrawerOpened, setAddDrawerOpened] = useState(false);
  const [editDrawerOpened, setEditDrawerOpened] = useState(false);
  const [deleteDrawerOpened, setDeleteDrawerOpened] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/expanse/get-Category`);
      const records = response.data.records || [];
      const recordsWithRowNumbers = records.map((item: any, index: number) => ({
        ...item,
        rowNumber: index + 1,
      }));
      setData(recordsWithRowNumbers);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error details:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle adding a new category
  const handleAddCategory = (newCategory: Category) => {
    setData((prevData) => {
      const updatedData = [
        { ...newCategory, _id: newCategory._id, rowNumber: 1 }, // New category with row number 1
        ...prevData,
      ];

      // Reassign row numbers to all items
      return updatedData.map((item, index) => ({
        ...item,
        rowNumber: index + 1,
      }));
    });
  };

// Handle updating a category
const handleUpdateCategory = (updatedCategory: Category) => {
  setData((prevData) => {
    return prevData.map((item) =>
      item._id === updatedCategory._id ? { ...updatedCategory } : item
    ).map((item, index) => ({
      ...item,
      rowNumber: index + 1, // Reassign row numbers after the update
    }));
  });
};
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo<MRT_ColumnDef<Category>[]>(() => [
    { accessorKey: "rowNumber", header: "No." },
    { accessorKey: "CategoryExpanse", header: "Category Name" },
    {
      id: 'actions',
      header: 'Actions',
      Cell: ({ row }) => (
        <>
          <Button onClick={() => handleEdit(row.original)}>Edit</Button>
          <Button
            color="red"
            onClick={() => handleDeleteCategory(row.original._id)}
            style={{ marginLeft: '8px' }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ], []);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditDrawerOpened(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setDeleteDrawerOpened(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Paper withBorder radius="md" p="md">
      <Title order={5}>Expense Categories</Title>
      <Space h="md" />
      <Button onClick={() => setAddDrawerOpened(true)}>Add Category</Button>
      <Space h="md" />
      <MantineReactTable
        columns={columns}
        data={data}
        mantinePaperProps={{ shadow: "0", withBorder: false }}
      />
      <AddCategory
        opened={addDrawerOpened}
        onClose={() => setAddDrawerOpened(false)}
        onAddCategory={handleAddCategory}
      />
      <EditCategory
        opened={editDrawerOpened}
        onClose={() => setEditDrawerOpened(false)}
        onUpdateCategory={handleUpdateCategory}
        categoryData={selectedCategory}
      />
      <DeleteCategory
        opened={deleteDrawerOpened}
        onClose={() => setDeleteDrawerOpened(false)}
        categoryId={selectedCategoryId || ""}
        onDeleteCategory={fetchData}
      />
    </Paper>
  );
};

export default CategoryExpanse;
