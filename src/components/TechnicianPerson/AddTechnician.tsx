import { useState } from "react";
import { Drawer, Button, TextInput, Group, Notification } from "@mantine/core";
import axios from "axios";
import { toast } from "react-toastify";
import API_BASE_URL from "@/utils/config";
import { Technician } from "./types";

interface AddTechnicianProps {
  opened: boolean;
  onClose: () => void;
  onAddTechnician: (newTechnician: Technician) => void;
}

const AddTechnician = ({ opened, onClose, onAddTechnician }: AddTechnicianProps) => {
  const [formData, setFormData] = useState({
    Technician_Person_name: "",
    Address: "",
    City: "",
    Mobile_1: "",
    Mobile_2: "",
    date: "",
  });

  const [error, setError] = useState<string | null>(null);

  // Handle input changes dynamically
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form fields
  const clearFields = () => {
    setFormData({
      Technician_Person_name: "",
      Address: "",
      City: "",
      Mobile_1: "",
      Mobile_2: "",
      date: "",
    });
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/technician/create-technician`, formData);

      // Update parent state immediately
      onAddTechnician(response.data.newTechnician);

      toast.success("Technician added successfully!");
      clearFields();
      onClose(); // Close drawer after successful submission
    } catch (err) {
      setError("Failed to add technician");
      toast.error("Failed to add technician");
      console.error("Error details:", err);
    }
  };

  return (
    <Drawer opened={opened} onClose={onClose} title="Add Technician">
      {error && <Notification color="red" mb="sm">{error}</Notification>}

      <TextInput
        label="Date"
        placeholder="Select a date"
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />
      <TextInput
        label="Technician Name"
        placeholder="Enter technician name"
        name="Technician_Person_name"
        value={formData.Technician_Person_name}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Address"
        placeholder="Enter address"
        name="Address"
        value={formData.Address}
        onChange={handleChange}
      />
      <TextInput
        label="City"
        placeholder="Enter city"
        name="City"
        value={formData.City}
        onChange={handleChange}
      />
      <TextInput
        label="Mobile 1"
        placeholder="Enter primary mobile number"
        name="Mobile_1"
        value={formData.Mobile_1}
        onChange={handleChange}
      />
      <TextInput
        label="Mobile 2"
        placeholder="Enter secondary mobile number"
        name="Mobile_2"
        value={formData.Mobile_2}
        onChange={handleChange}
      />


      <Group justify="flex-end" mt="md">
        <Button onClick={handleAdd}>Add Technician</Button>
      </Group>
    </Drawer>
  );
};

export default AddTechnician;
