"use client";

import {
  Button,
  Drawer,
  TextInput,
  NumberInput,
  Textarea,
  Select,
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary

interface AddExpanseProps {
  opened: boolean;
  onClose: () => void;
  onAddExpanse: (newExpanse: any) => void;
}

interface DropdownOption {
  value: string;
  label: string;
}

export const AddExpanse = ({ opened, onClose, onAddExpanse }: AddExpanseProps) => {
  const [categories, setCategories] = useState<DropdownOption[]>([]);
  const [accounts, setAccounts] = useState<DropdownOption[]>([]);
  const [numbers, setNumbers] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [openNumberModal, setOpenNumberModal] = useState(false);
  const [newAccount, setNewAccount] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const form = useForm({
    initialValues: {
      Expanse_name: "",
      Amount: 0,
      Category: "",
      Remarks: "",
      Debit: "0",
      Account_Title: "",
      Account_Number: "",
      indate: "",
    },
    validate: {
      Expanse_name: (value) => (value ? null : "Expanse name is required"),
      Amount: (value) => (value > 0 ? null : "Amount must be positive"),
      Category: (value) => (value ? null : "Category is required"),
      Account_Title: (value) => (value ? null : "Account title is required"),
      indate: (value) => (value ? null : "Date is required"),
    },
  });

	useEffect(() => {
		const fetchDropdownData = async () => {
			try {
				const [accountResponse, numberResponse] = await Promise.all([
					axios.get(`${API_BASE_URL}/api/accountexpanse/get-Account-Title-Expanse`),
					axios.get(`${API_BASE_URL}/api/accountexpanse/get-Expanse-Number`),
				]);

				setAccounts(
					accountResponse.data.getaccount?.map((account: any) => ({
						value: account.AccountExpanseTitle || "N/A",
						label: account.AccountExpanseTitle || "N/A",
					})) || []
				);

				setNumbers(
					numberResponse.data.getnumber?.map((number: any) => ({
						value: number.AccountExpanseNumber || "N/A",
						label: number.AccountExpanseNumber || "N/A",
					})) || []
				);
			} catch (error) {
				console.error("Error fetching dropdown data:", error);
			}
		};



   const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/expanse/get-Category`);
        setCategories(
          response.data.records?.map((category: any) => ({
            value: category.CategoryExpanse,
            label: category.CategoryExpanse,
          })) || []
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchDropdownData();
    fetchCategories();
  }, []);

	const handleNewEntry = async (entry: string, type: "Account" | "Number") => {
		try {
			const url =
				type === "Account"
					? `${API_BASE_URL}/api/accountexpanse/create-Account-Title-Expanse`
					: `${API_BASE_URL}/api/accountexpanse/create-Expanse-Number`;

			const requestBody =
				type === "Account"
					? { AccountExpanseTitle: entry }
					: { AccountExpanseNumber: entry };

			await axios.post(url, requestBody);

			if (type === "Account") {
				setAccounts([...accounts, { value: entry, label: entry }]);
			} else {
				setNumbers([...numbers, { value: entry, label: entry }]);
			}

			toast.success(`${type} created successfully!`);
		} catch (error) {
			console.error(`Error adding ${type.toLowerCase()}:`, error);
			toast.error(`Failed to add ${type.toLowerCase()}.`);
		}

		type === "Account" ? setOpenAccountModal(false) : setOpenNumberModal(false);
	};


  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/expanse/create-expanse`, values);
      toast.success("Expanse added successfully!");
      form.reset();
      onAddExpanse(values); // Pass data to parent
      onClose();
    } catch (error) {
      console.error("Error adding expanse:", error);
      toast.error("Failed to add expanse.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Drawer opened={opened} onClose={onClose} title="Add Expanse" padding="xl" size="sm">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Date"
            type="date"
            required
            placeholder="Select date"
            {...form.getInputProps("indate")}
          />
          <TextInput
            label="Expanse Name"
            required
            placeholder="Enter expanse name"
            {...form.getInputProps("Expanse_name")}
          />
          <NumberInput
            label="Amount"
            required
            placeholder="Enter amount"
            {...form.getInputProps("Amount")}
          />
          <Select
            label="Category"
            searchable
            required
            placeholder="Select category"
            data={categories}
            {...form.getInputProps("Category")}
          />

          <Textarea
            label="Remarks"
            placeholder="Enter remarks"
            {...form.getInputProps("Remarks")}
          />

          <TextInput
            label="Debit"
            placeholder="Enter debit"
            {...form.getInputProps("Debit")}
          />

          <Select
            label="Title Transaction"
            searchable
            placeholder="Select account title"
            data={[...accounts, { value: "add-new", label: "Add New" }]}
            value={form.values.Account_Title}
            onChange={(value) => {
              if (value === "add-new") {
                setOpenAccountModal(true);
              } else {
                form.setFieldValue("Account_Title", value || "");
              }
            }}
          />

          <Select
            label="Account Number"
            searchable
            placeholder="Select account number"
            data={[...numbers, { value: "add-new", label: "Add New" }]}
            value={form.values.Account_Number}
            onChange={(value) => {
              if (value === "add-new") {
                setOpenNumberModal(true);
              } else {
                form.setFieldValue("Account_Number", value || "");
              }
            }}
          />

          <Button type="submit" mt="sm" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Expanse"}
          </Button>
        </form>
      </Drawer>

      <Modal opened={openAccountModal} onClose={() => setOpenAccountModal(false)}>
        <TextInput
          label="New Account"
          value={newAccount}
          onChange={(e) => setNewAccount(e.target.value)}
          placeholder="Enter new account name"
        />
        <Button onClick={() => handleNewEntry(newAccount, "Account")}>Add Account</Button>
      </Modal>

      <Modal opened={openNumberModal} onClose={() => setOpenNumberModal(false)}>
        <TextInput
          label="New Number"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
          placeholder="Enter new account number"
        />
        <Button onClick={() => handleNewEntry(newNumber, "Number")}>Add Number</Button>
      </Modal>
    </>
  );
};
