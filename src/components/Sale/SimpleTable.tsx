"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Paper, Space, Title, Button } from "@mantine/core";
import { type MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import axios from "axios";
import API_BASE_URL from "@/utils/config";
import AddSale from "./AddSale";
import EditSale from "./EditSale";
import DeleteSale from "./DeleteSale";
import { Sale } from "./types";

export const SimpleTable = () => {
  const [data, setData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDrawerOpened, setAddDrawerOpened] = useState(false);
  const [editDrawerOpened, setEditDrawerOpened] = useState(false);
  const [deleteDrawerOpened, setDeleteDrawerOpened] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/saleperson/get-sale`);
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

  const columns = useMemo<MRT_ColumnDef<Sale>[]>(
    () => [
      { accessorKey: "rowNumber", header: "No.", size: 30 },
      { accessorKey: "date", header: "Date", size: 30 },
      { accessorKey: "Sale_Person_name", header: "Sale Person Name", size: 50 },
      { accessorKey: "Address", header: "Address", size: 80 },
      { accessorKey: "City", header: "City", size: 70 },
      { accessorKey: "Deluxe", header: "Deluxe", size: 30 },
      { accessorKey: "Ultimate", header: "Ultimate", size: 30 },
      { accessorKey: "Self", header: "Self", size: 30 },
      { accessorKey: "Mobile_1", header: "Mobile 1", size: 50 },
      { accessorKey: "Mobile_2", header: "Mobile 2", size: 50 },
      {
        id: "actions",
        header: "Actions",
        size: 180,
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <Button onClick={() => handleEdit(row.original)} color="green" size="xs">
              Edit
            </Button>
            <Button color="red" onClick={() => handleDeleteSale(row.original._id)} size="xs">
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    setEditDrawerOpened(true);
  };

  const handleDeleteSale = (saleId: string) => {
    setSelectedSaleId(saleId);
    setDeleteDrawerOpened(true);
  };

  const handleAddSale = (newSale: Sale) => {
    setData((prevData) => [...prevData, { ...newSale, rowNumber: prevData.length + 1 }]);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Paper withBorder radius="md" p="md">
      <Title order={5}>Sale Records</Title>
      <Space h="md" />
      <Button onClick={() => setAddDrawerOpened(true)}>Add Sale Person</Button>
      <Space h="md" />

      {/* Table Component */}
      <MantineReactTable
        columns={columns}
        data={data}
        mantinePaperProps={{ shadow: "xs", withBorder: true }}
        mantineTableContainerProps={{
          style: { width: "100%", overflowX: "auto", maxHeight: "490px" },
        }}
        mantineTableProps={{
          verticalSpacing: "md",
          horizontalSpacing: "md",
        }}
      />

      {/* Add/Edit/Delete Drawers */}
      <AddSale opened={addDrawerOpened} onClose={() => setAddDrawerOpened(false)} onAddSale={handleAddSale} />
      <EditSale opened={editDrawerOpened} onClose={() => setEditDrawerOpened(false)} onUpdateSale={fetchData} saleData={selectedSale} />
      <DeleteSale opened={deleteDrawerOpened} onClose={() => setDeleteDrawerOpened(false)} saleId={selectedSaleId || ""} onDeleteSale={fetchData} />
    </Paper>
  );
};

export default SimpleTable;
