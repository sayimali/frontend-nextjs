"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Paper, Space, Title, Button } from "@mantine/core";
import { type MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import axios from "axios";
import AddTechnician from "./AddTechnician";
import EditTechnician from "./EditTechnician";
import DeleteTechnician from "./DeleteTechnician";
import API_BASE_URL from "@/utils/config";
import { Technician } from "./types";
import { toast } from "react-toastify";

export const TechnicianTable = () => {
  const [data, setData] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDrawerOpened, setAddDrawerOpened] = useState(false);
  const [editDrawerOpened, setEditDrawerOpened] = useState(false);
  const [deleteDrawerOpened, setDeleteDrawerOpened] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/technician/get-technician`);
      const records = response.data.records || [];
      const numberedData = records.map((item: Technician, index: number) => ({
        ...item,
        rowNumber: index + 1,
      }));
      setData(numberedData);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error details:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddTechnician = (newTechnician: Technician) => {
    setData((prevData) => [
      { ...newTechnician, rowNumber: 1 },
      ...prevData.map((item, index) => ({ ...item, rowNumber: index + 2 })),
    ]);
  };

  const handleUpdateTechnician = async (updatedTechnician: Technician) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/technician/update-technician/${updatedTechnician._id}`,
        updatedTechnician
      );

      if (response.status === 200) {
        setData((prevData) =>
          prevData.map((item) =>
            item._id === updatedTechnician._id
              ? { ...response.data.updatedTechnician, rowNumber: item.rowNumber }
              : item
          )
        );
        setEditDrawerOpened(false);
        toast.success("Technician updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update technician:", error);
      toast.error("Failed to update technician.");
    }
  };

  const handleEdit = (technician: Technician) => {
    setSelectedTechnician(technician);
    setEditDrawerOpened(true);
  };

  const handleDeleteTechnician = (technicianId: string) => {
    if (technicianId) {
      setSelectedTechnicianId(technicianId);
      setDeleteDrawerOpened(true);
    }
  };

	const columns = useMemo<MRT_ColumnDef<Technician>[]>(() => [
		{ accessorKey: "rowNumber", header: "No.", size: 30 },
		{ accessorKey: "date", header: "Date", size: 30 },
		{ accessorKey: "Technician_Person_name", header: "Technician Name", size: 50 },
		{ accessorKey: "Address", header: "Address", size: 70 },
		{ accessorKey: "City", header: "City", size: 70 },
		{ accessorKey: "Mobile_1", header: "Mobile 1", size: 50},
		{ accessorKey: "Mobile_2", header: "Mobile 2", size: 50 },

		{
			id: "actions",
			header: "Actions",
			size: 180, // Adjust width for actions column
			Cell: ({ row }) => (
				<div style={{ display: "flex", gap: "8px" }}>
					<Button onClick={() => handleEdit(row.original)} color="green">
						Edit
					</Button>
					<Button
						color="red"
						onClick={() => handleDeleteTechnician(row.original._id || "")}
					>
						Delete
					</Button>
				</div>
			),
		},
	], []);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Paper withBorder radius="md" p="md">
      <Title order={5}>Technician Records</Title>
      <Space h="md" />
      <div style={{ display: "flex", gap: "10px" }}>
        <Button onClick={() => setAddDrawerOpened(true)}>Add Technician</Button>
        <Button onClick={fetchData} color="blue">Refresh</Button>
      </div>
      <Space h="md" />
      <MantineReactTable
        key={data.length}
        columns={columns}
        data={data}
        mantinePaperProps={{ shadow: "0", withBorder: false }}
      />
      <AddTechnician
        opened={addDrawerOpened}
        onClose={() => setAddDrawerOpened(false)}
        onAddTechnician={handleAddTechnician}
      />
      <EditTechnician
        opened={editDrawerOpened}
        onClose={() => setEditDrawerOpened(false)}
        onUpdateTechnician={handleUpdateTechnician}
        technicianData={selectedTechnician}
      />
      <DeleteTechnician
        opened={deleteDrawerOpened}
        onClose={() => setDeleteDrawerOpened(false)}
        technicianId={selectedTechnicianId}
        onDeleteTechnician={fetchData}
      />
    </Paper>
  );
};

export default TechnicianTable;
