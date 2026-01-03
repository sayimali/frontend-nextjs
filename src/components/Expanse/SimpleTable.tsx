"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Paper, Space, Title, Button, Modal } from "@mantine/core";
import { type MRT_ColumnDef, MantineReactTable, type MRT_Row } from "mantine-react-table";
import axios from "axios";
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary
import { AddExpanse } from "./AddExpanse";
import { EditExpanse } from "./EditExpanse";
import { Expanse } from "./types";
import { format } from "date-fns"; // Import date-fns for formatting dates

export const SimpleTable = () => {
  const [data, setData] = useState<Expanse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDrawerOpened, setAddDrawerOpened] = useState(false);
  const [editDrawerOpened, setEditDrawerOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false); // State for modal
  const [selectedExpanseId, setSelectedExpanseId] = useState<string | null>(null);
  const [selectedExpanse, setSelectedExpanse] = useState<Expanse | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors when refreshing data
    try {
      const response = await axios.get(`${API_BASE_URL}/api/expanse/get-Expanse`);
      const records = response.data.records || [];
      const recordsWithRowNumbers = records.map((item: Expanse, index: number) => ({
        ...item,
        rowNumber: index + 1,
        indate: new Date(item.indate), // Ensure indate is a Date object
      }));
      setData(recordsWithRowNumbers);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (expanse: Expanse) => {
    setSelectedExpanse(expanse);
    setEditDrawerOpened(true);
  };

  const handleDeleteExpanse = (expanseId: string) => {
    setSelectedExpanseId(expanseId);
    setDeleteModalOpened(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    if (selectedExpanseId) {
      try {
        await axios.delete(`${API_BASE_URL}/api/expanse/delete-expanse/${selectedExpanseId}`);
        setDeleteModalOpened(false); // Close modal after delete
        fetchData(); // Re-fetch data after delete
      } catch (err) {
        console.error("Error deleting expanse", err);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpened(false); // Close modal if canceled
  };

	const columns = useMemo<MRT_ColumnDef<Expanse>[]>(() => [
		{ accessorKey: "rowNumber", header: "No.", size: 30 },
		{
			accessorKey: "indate",
			header: "Date",
			size: 40,
			Cell: ({ row }: { row: MRT_Row<Expanse> }) =>
				format(new Date(row.original.indate), "yyyy-MM-dd"),
		},
		{ accessorKey: "Expanse_name", header: "Expanse Name", size: 50 },
		{
			accessorKey: "Amount",
			header: "Amount",
			size: 70,
			Cell: ({ cell }) => {
				const value = cell.getValue<number>();
				return `${value != null && !isNaN(value) ? value.toFixed(2) : ""}`;
			},
		},
		{ accessorKey: "Category", header: "Category", size: 100 },
		{ accessorKey: "Remarks", header: "Remarks", size: 150 },
		{ accessorKey: "Debit", header: "Debit", size: 50 },
		{ accessorKey: "Account_Title", header: "Title Transaction", size: 100 },
		{ accessorKey: "Account_Number", header: "Account Number", size: 70 },

		{
			id: "actions",
			header: "Actions",
			size: 180,
			Cell: ({ row }) => (
				<>
					<Button size="xs" onClick={() => handleEdit(row.original)}>Edit</Button>
					<Button size="xs" color="red" onClick={() => handleDeleteExpanse(row.original._id)}>
						Delete
					</Button>
				</>
			),
		},
	], []);
		// Return the table only if data is available or if it's empty (without a "Loading..." message)
  if (error) return <div>{error}</div>;

  return (
    <Paper withBorder radius="md" p="md">
      <Title order={5}>Expanse Records</Title>
      <Space h="md" />
      <Button onClick={() => setAddDrawerOpened(true)}>Add Expanse</Button>
      <Button
        onClick={fetchData}
        style={{ marginLeft: "10px" }}
        disabled={loading} // Disable the button while loading
      >
        Refresh Data
      </Button>
      <Space h="md" />

      {/* Render the table only if data is loaded */}
      {data.length === 0 ? (
        <p>No expanse records available</p>
      ) : (
        <MantineReactTable columns={columns} data={data} mantinePaperProps={{ shadow: "0", withBorder: false }} />
      )}

      <AddExpanse opened={addDrawerOpened} onClose={() => setAddDrawerOpened(false)} onAddExpanse={fetchData} />
      <EditExpanse opened={editDrawerOpened} onClose={() => setEditDrawerOpened(false)} onUpdateExpanse={fetchData} expanseData={selectedExpanse} />

      {/* Confirmation modal for deleting expanse */}
      <Modal opened={deleteModalOpened} onClose={cancelDelete} title="Are you sure you want to delete this data?">
        <Button color="red" onClick={confirmDelete}>Yes, delete</Button>
        <Button onClick={cancelDelete}>No, cancel</Button>
      </Modal>
    </Paper>
  );
};
