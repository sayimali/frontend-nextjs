"use client";

import { Button, Drawer, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { Sale } from "./types";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/utils/config";
import { toast } from "react-toastify";

interface EditSaleProps {
  opened: boolean;
  onClose: () => void;
  onUpdateSale: (updatedSale: Sale) => void;
  saleData: Sale | null;
}

const EditSale: React.FC<EditSaleProps> = ({ opened, onClose, onUpdateSale, saleData }) => {
  const [loading, setLoading] = useState(false); // Loading state

  const form = useForm({
    initialValues: {
      Sale_Person_name: "",
      Address: "",
      City: "",
      Deluxe: "",
      Ultimate: "",
      Self: "",
      Mobile_1: "",
      Mobile_2: "",
      date: new Date().toISOString().split("T")[0],
    },

  });

  // Update form values when `saleData` changes
  useEffect(() => {
    if (saleData) {
      form.setValues({
        Sale_Person_name: saleData.Sale_Person_name,
        Address: saleData.Address,
        City: saleData.City,
        Deluxe: saleData.Deluxe,
        Ultimate: saleData.Ultimate,
        Self: saleData.Self,
        Mobile_1: saleData.Mobile_1.toString(),
        Mobile_2: saleData.Mobile_2.toString(),
        date: saleData.date,
      });
    } else {
      form.reset();
    }
  }, [saleData]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!saleData) return;

    setLoading(true); // Start loading

    try {
      const response = await axios.put(`${API_BASE_URL}/api/saleperson/update-sale/${saleData._id}`, values);
      onUpdateSale(response.data.sale);
      toast.success("Salesperson updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating sale:", error);
      toast.error("Failed to update sale. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Drawer opened={opened} onClose={onClose} title="Edit Sale Person" padding="md" size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
			<TextInput required label="Date" type="date" {...form.getInputProps("date")} />
        <TextInput required label="Sale Person Name" {...form.getInputProps("Sale_Person_name")} />
        <TextInput required label="Address" {...form.getInputProps("Address")} />
        <TextInput required label="City" {...form.getInputProps("City")} />
        <TextInput required label="Deluxe" {...form.getInputProps("Deluxe")} />
        <TextInput required label="Ultimate" {...form.getInputProps("Ultimate")} />
        <TextInput required label="Self" {...form.getInputProps("Self")} />
        <TextInput required label="Mobile 1" {...form.getInputProps("Mobile_1")} />
        <TextInput required label="Mobile 2" {...form.getInputProps("Mobile_2")} />


        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Sale Person"}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

export default EditSale;
