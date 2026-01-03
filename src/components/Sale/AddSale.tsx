"use client";

import { Button, Drawer, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { Sale } from "./types";
import { useEffect } from "react";
import API_BASE_URL from "@/utils/config"; // Adjust path as necessary
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddSaleProps {
  opened: boolean;
  onClose: () => void;
  onAddSale: (newSale: Sale) => void;
}

// Define form values type
interface SaleFormValues {
  Sale_Person_name: string;
  Address: string;
  City: string;
  Deluxe: string;
  Ultimate: string;
  Self: string;
  Mobile_1: string;
  Mobile_2: string;
  date: string;
}

const AddSale: React.FC<AddSaleProps> = ({ opened, onClose, onAddSale }) => {
  const form = useForm<SaleFormValues>({
    initialValues: {
      Sale_Person_name: "",
      Address: "",
      City: "",
      Deluxe: "",
      Ultimate: "",
      Self: "",
      Mobile_1: "",
      Mobile_2: "",
      date: "",
    },
    validate: {
      Sale_Person_name: (value) => (value.trim().length < 3 ? "Name must be at least 3 characters" : null),
      Address: (value) => (value.trim().length < 5 ? "Address must be at least 5 characters" : null),
      City: (value) => (value.trim().length < 3 ? "Enter a valid city name" : null),
      Deluxe: (value) => (!value ? "Enter Deluxe amount" : null),
      Ultimate: (value) => (!value ? "Enter Ultimate amount" : null),
      Self: (value) => (!value ? "Enter Self amount" : null),
      Mobile_1: (value) => (!/^\d{10,12}$/.test(value) ? "Enter a valid mobile number" : null),
      Mobile_2: (value) => (!/^\d{10,12}$/.test(value) ? "Enter a valid mobile number" : null),
      date: (value) => (!value ? "Select a date" : null),
    },
  });

  useEffect(() => {
    if (opened) {
      form.reset();
    }
  }, [opened]);

  const handleSubmit = async (values: SaleFormValues) => {
    try {
      console.log("Form Values: ", values);
      const response = await axios.post(`${API_BASE_URL}/api/saleperson/create-sale`, values);
      console.log("Response Data: ", response.data);

      onAddSale(response.data.sale);
      form.reset();
      onClose();

      toast.success("Salesperson added successfully!");
    } catch (error: any) {
      console.error("Error adding sale:", error);
      toast.error(error.response?.data?.message || "An error occurred while adding the sale.");
    }
  };

  return (
    <>
      <Drawer opened={opened} onClose={onClose} title="Add Sale Person" padding="md" size="lg">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput required label="Date" type="date" {...form.getInputProps("date")} />
          <TextInput required label="Sale Person Name" placeholder="Enter Name" {...form.getInputProps("Sale_Person_name")} />
          <TextInput required label="Address" placeholder="Enter Address" {...form.getInputProps("Address")} />
          <TextInput required label="City" placeholder="City" {...form.getInputProps("City")} />
          <TextInput required label="Deluxe" placeholder="Deluxe" {...form.getInputProps("Deluxe")} />
          <TextInput required label="Ultimate" placeholder="Ultimate" {...form.getInputProps("Ultimate")} />
          <TextInput required label="Self" placeholder="Self" {...form.getInputProps("Self")} />
          <TextInput required label="Mobile 1" placeholder="92312345678" {...form.getInputProps("Mobile_1")} />
          <TextInput required label="Mobile 2" placeholder="92312345678" {...form.getInputProps("Mobile_2")} />

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <Button type="submit">Add Sale Person</Button>
          </div>
        </form>
      </Drawer>

      <ToastContainer />
    </>
  );
};

export default AddSale;
