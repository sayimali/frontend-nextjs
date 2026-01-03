import { useEffect, useState } from "react";
import { Drawer, Button, TextInput, Group, Notification } from "@mantine/core";
import axios from "axios";
import { Technician } from "./types";
import API_BASE_URL from "@/utils/config";

interface EditTechnicianProps {
  opened: boolean;
  onClose: () => void;
  onUpdateTechnician: (updatedTechnician: Technician) => void;
  technicianData: Technician | null;
}

const EditTechnician = ({ opened, onClose, onUpdateTechnician, technicianData }: EditTechnicianProps) => {
  const [formData, setFormData] = useState({
    Technician_Person_name: "",
    Address: "",
    City: "",
    Mobile_1: "",
    Mobile_2: "",
    date: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (technicianData) {
      setFormData({
        Technician_Person_name: technicianData.Technician_Person_name || "",
        Address: technicianData.Address || "",
        City: technicianData.City || "",
        Mobile_1: technicianData.Mobile_1 || "",
        Mobile_2: technicianData.Mobile_2 || "",
        date: technicianData.date || "",
      });
    } else {
      clearFields();
    }
  }, [technicianData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearFields = () => {
    setFormData({
      Technician_Person_name: "",
      Address: "",
      City: "",
      Mobile_1: "",
      Mobile_2: "",
      date: "",
    });
    setError(null);
  };

  const handleUpdate = async () => {
    if (!technicianData) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/technician/update-technician/${technicianData._id}`,
        formData
      );

      onUpdateTechnician(response.data.updatedTechnician || response.data);
      onClose();
    } catch (err) {
      setError("Failed to update technician");
      console.error("Error details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer opened={opened} onClose={onClose} title="Edit Technician" size="md">
      {error && <Notification color="red" mb="sm">{error}</Notification>}

      <TextInput
        label="Technician Name"
        placeholder="Enter technician name"
        name="Technician_Person_name"
        value={formData.Technician_Person_name}
        onChange={handleChange}
        required
      />
      <TextInput label="Address" placeholder="Enter address" name="Address" value={formData.Address} onChange={handleChange} />
      <TextInput label="City" placeholder="Enter city" name="City" value={formData.City} onChange={handleChange} />
      <TextInput label="Mobile 1" placeholder="Enter primary mobile number" name="Mobile_1" value={formData.Mobile_1} onChange={handleChange} />
      <TextInput label="Mobile 2" placeholder="Enter secondary mobile number" name="Mobile_2" value={formData.Mobile_2} onChange={handleChange} />
      <TextInput label="Date" placeholder="Select a date" type="date" name="date" value={formData.date} onChange={handleChange} />

      <Group justify="flex-end" mt="md">
        <Button onClick={handleUpdate} loading={loading} disabled={loading}>
          {loading ? "Updating..." : "Update Technician"}
        </Button>
      </Group>
    </Drawer>
  );
};

export default EditTechnician;
