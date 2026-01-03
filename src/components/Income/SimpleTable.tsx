"use client";

import { useEffect, useState, useMemo } from "react";
import { Paper, Space, Title, Button, Alert, Modal } from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { type MRT_ColumnDef, MantineReactTable, type MRT_Row } from "mantine-react-table";
import { type MRT_Cell } from "mantine-react-table"; // Import MRT_Cell
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary

import axios from "axios";
import { AddIncome } from "./AddIncome";
import { EditIncome } from "./EditIncome";
import { DeleteIncome } from "./DeleteIncome";
import { format } from "date-fns"; // Import date-fns for formatting dates

type Person = {
  _id: string;
  Sale_Person_name: string;
  Vehicle: string;
  PartyName: string;
  Category: string;
  Device: string;
  Package: string;
  Subscription_Amount: number;
  Amount_Received: number;
  Saleperson_FixedPrice: number;
  Excess_Amount: number | null;
	Pending_Payment: number | null;
	Pending_Recovery: number ;
  City: string;
  Account_Title_SalePerson: string;
	Account_Title_Number: string;
  Sale_Person_Remarks: string;
  Technician_Person_name: string;
  Technicianperson_Price: number;
  Travelling_Expense_Technician: number;
  Technician_Expanse: number | null;
  Account_Title_TechnicianPerson: string;
  Technician_Person_Remarks: string;
  Total_Amount: number;
  indate: Date;
  rowNumber?: number;
};

export const SimpleTable = () => {
  const [data, setData] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
	const [totals, setTotals] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [addDrawerOpened, setAddDrawerOpened] = useState(false);
  const [editDrawerOpened, setEditDrawerOpened] = useState(false);
  const [deleteDrawerOpened, setDeleteDrawerOpened] = useState(false);
  const [selectedIncomeId, setSelectedIncomeId] = useState<string | null>(null);
  const [selectedIncome, setSelectedIncome] = useState<Person | null>(null);
	const [selectedIncomeIDDelete, setSelectedIncomeIDDelete] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

	const fetchData = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API_BASE_URL}/api/income/get-income`);

			if (response.data && Array.isArray(response.data.records)) {
				// Transform records array
				const numberedData = response.data.records.map((item: Person, index: number) => ({
					...item,
					rowNumber: index + 1,
					indate: new Date(item.indate), // Ensure date format
				}));

				setData(numberedData);
				setTotals(response.data); // Store total values separately
			} else {
				throw new Error("Unexpected response structure");
			}
		} catch (err) {
			setError("Failed to fetch income records. Please try again later.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);
  const handleEdit = (income: Person) => {
    setSelectedIncome(income);
    setEditDrawerOpened(true);
  };

	const handleDeleteIncome = (incomeId: string) => {
    setSelectedIncomeIDDelete(incomeId); // Store only the string ID
    setDeleteDrawerOpened(true);
};

  // New function to refresh data
  const refreshData = async () => {
    await fetchData();
  };

	const columns = useMemo<MRT_ColumnDef<Person>[]>(() => [
		{ accessorKey: "rowNumber", header: "No.", size: 20 },
		{
			accessorKey: "indate",
			header: "Date",
			size: 50,
			Cell: ({ row }: { row: MRT_Row<Person> }) => (
				format(new Date(row.original.indate), "yyyy-MM-dd")
			),
		},
		{ accessorKey: "Sale_Person_name", header: "Sale Person Name", size: 50 },
		{ accessorKey: "Vehicle", header: "Vehicle", size: 70},
		{ accessorKey: "PartyName", header: "Party Name", size: 80 },
		{ accessorKey: "Category", header: "Category", size: 70 },
		{ accessorKey: "Device", header: "Device", size: 50 },
		{ accessorKey: "Package", header: "Package", size: 70 },
		{ accessorKey: "Subscription_Amount", header: "Subscription Amount", size: 50 },
		{ accessorKey: "Amount_Received", header: "Amount Received", size: 50 },
		{ accessorKey: "Saleperson_FixedPrice", header: "Sale Person Fixed Price", size: 200 },
		{
			accessorKey: "Excess_Amount",
			header: "Excess Amount",
			size: 50,
			Cell: ({ row }: { row: MRT_Row<Person> }) => (
				<div style={{ backgroundColor: "yellow", padding: "8px" }}>
					{row.original.Excess_Amount}
				</div>
			),
		},
		{
			accessorKey: "Pending_Payment",
			header: "Pending Payment",
			size: 50,
			Cell: ({ row }: { row: MRT_Row<Person> }) => (
				<div style={{ backgroundColor: "lightblue", padding: "8px" }}>
					{row.original.Pending_Payment}
				</div>
			),
		},
		{
			accessorKey: "Pending_Recovery",
			header: "Pending Recovery",
			size: 50,
			Cell: ({ row }: { row: MRT_Row<Person> }) => (
				<div style={{ backgroundColor: "lightgreen", padding: "8px" }}>
					{row.original.Pending_Recovery}
				</div>
			),
		},
		{ accessorKey: "City", header: "City", size: 70 },
		{ accessorKey: "Account_Title_SalePerson", header: "Title Transaction", size: 80 },
		{ accessorKey: "Account_Title_Number", header: "Account Number", size: 80 },
		{ accessorKey: "Technician_Person_name", header: "Technician Name", size: 80 },
		{ accessorKey: "Technicianperson_Price", header: "Installation Expense", size: 50 },
		{ accessorKey: "Travelling_Expense_Technician", header: "Traveling Expense", size: 50 },
		{ accessorKey: "Technician_Expanse", header: "Technician Expense", size: 50 },
		{
			accessorKey: "Total_Amount",
			header: "Total Amount",
			size: 50,
			Cell: ({ row }: { row: MRT_Row<Person> }) => (
				<div style={{ backgroundColor: "lightgreen", padding: "8px" }}>
					{row.original.Total_Amount}
				</div>
			),
		},
		{ accessorKey: "Technician_Person_Remarks", header: "Remarks", size: 100 },
		{
			id: "actions",
			header: "Actions",
			size: 190,
			Cell: ({ row }: { row: MRT_Row<Person> }) => (
				<>
					<Button onClick={() => handleEdit(row.original)}>Edit</Button>
					<Button color="red" onClick={() => handleDeleteIncome(row.original._id)}>Delete</Button>
				</>
			),
		},
	], []);


  if (loading) return <div>Loading...</div>;
  if (error) return <Alert color="red">{error}</Alert>;

	function incomeId(): void {
		throw new Error("Function not implemented.");
	}

  return (
    <Paper withBorder radius="md" p="md">
      <Title order={5}>Income Records</Title>
      <Space h="md" />
      <Button onClick={() => setAddDrawerOpened(true)}>Add Income</Button>
      <Button onClick={refreshData} ml="md">Refresh</Button> {/* Refresh button */}
      <Space h="md" />
      <MantineReactTable columns={columns} data={data} mantinePaperProps={{ shadow: "xs", withBorder: true }} />
      <AddIncome opened={addDrawerOpened} onClose={() => setAddDrawerOpened(false)} onAddIncome={fetchData} />
      <EditIncome opened={editDrawerOpened} onClose={() => setEditDrawerOpened(false)} onUpdateIncome={fetchData} incomeData={selectedIncome} />
			<DeleteIncome
  opened={deleteDrawerOpened}
  onClose={() => setDeleteDrawerOpened(false)}
  onDeleteIncome={fetchData} // Function to refresh after delete
  incomeId={selectedIncomeIDDelete ?? ""} // Default to empty string if null
/>
    </Paper>
  );
};

export default SimpleTable;
