"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Paper, Space, Title, Button } from "@mantine/core";
import { type MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import axios from "axios";
import AddUser from "./AddUser";
import EditUser from "./Edituser";
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary
import DeleteUserModal from "./DeleteUserModal";
import { User } from "./types";

export const SimpleTable = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDrawerOpened, setAddDrawerOpened] = useState(false);
  const [editDrawerOpened, setEditDrawerOpened] = useState(false);
  const [deleteDrawerOpened, setDeleteDrawerOpened] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Function to fetch data from the backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/all-users`);
      const records = Array.isArray(response.data) ? response.data : response.data.records || [];
      const recordsWithRowNumbers = records.map((item: any, index: number) => ({
        ...item,
        rowNumber: index + 1,
      }));
      setData(recordsWithRowNumbers);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new user and refresh data from the backend
  const handleAddUser = (newUser: User) => {
    setData((prevData) => [{ ...newUser, rowNumber: prevData.length + 1 }, ...prevData]);
    // Re-fetch data from the backend to ensure it is consistent
    fetchData();
  };

  // Update existing user
  const handleUpdateUser = (updatedUser: User) => {
    setData((prevData) =>
      prevData.map((item) => (item._id === updatedUser._id ? { ...updatedUser } : item))
    );
  };

  // Open the edit drawer and set the selected user
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditDrawerOpened(true);
  };

  // Open the delete modal and set the selected user ID
  const handleDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteDrawerOpened(true);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Table columns configuration
  const columns = useMemo<MRT_ColumnDef<User>[]>(() => [
    { accessorKey: "rowNumber", header: "No." },
    { accessorKey: "username", header: "User Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "Mobile_1", header: "Mobile 1" },
    { accessorKey: "Mobile_2", header: "Mobile 2" },
    { accessorKey: "role", header: "Role" },
    {
      id: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <>
          <Button onClick={() => handleEdit(row.original)}>Edit</Button>
          <Button
            color="red"
            onClick={() => handleDeleteModal(row.original._id)}
            style={{ marginLeft: "8px" }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ], []);

  // Loading and error handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Render the table, drawers, and Refresh button
  return (
    <Paper withBorder radius="md" p="md">
      <Title order={5}>User Records</Title>
      <Space h="md" />
      <Button onClick={() => setAddDrawerOpened(true)}>Add User</Button>
      <Space h="md" />
      <Button onClick={fetchData} color="blue" style={{ marginBottom: "16px" }}>
        Refresh
      </Button>
      <MantineReactTable
        columns={columns}
        data={data}
        mantinePaperProps={{ shadow: "0", withBorder: false }}
      />
      <AddUser
        opened={addDrawerOpened}
        onClose={() => setAddDrawerOpened(false)}
        onAddUser={handleAddUser}
      />
      <EditUser
        opened={editDrawerOpened}
        onClose={() => setEditDrawerOpened(false)}
        onUpdateUser={handleUpdateUser}
        userData={selectedUser}
      />
      <DeleteUserModal
        opened={deleteDrawerOpened}
        onClose={() => setDeleteDrawerOpened(false)}
        userId={selectedUserId || ""}
        onDeleteUser={fetchData}
      />
    </Paper>
  );
};

export default SimpleTable;
