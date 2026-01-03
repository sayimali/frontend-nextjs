"use client"
import {
  Button,
  Drawer,
  TextInput,
  NumberInput,
  Textarea,
  Select,
  Space,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary
// Define DropdownOption type
interface DropdownOption {
  value: string;
  label: string;
}
// Define the EditIncomeProps interface
interface EditIncomeProps {
  opened: boolean;
  onClose: () => void;
  incomeData: any; // Replace 'any' with the actual data type if known
  onUpdateIncome: (updatedIncome: any) => void;
}

export const EditIncome = ({
  opened,
  onClose,
  incomeData,
  onUpdateIncome,
}: EditIncomeProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [devices, setDevices] = useState<DropdownOption[]>([]);
  const [packages, setPackages] = useState<DropdownOption[]>([]);
	const [numbers,    setNumbers] = useState<DropdownOption[]>([]);
  const [cities, setCities] = useState<DropdownOption[]>([]);
  const [accounts, setAccounts] = useState<DropdownOption[]>([]);
  const [technicians, setTechnicians] = useState<DropdownOption[]>([]);
  const [salespersons, setSalespersons] = useState<DropdownOption[]>([]);

  const [error, setError] = useState<string | null>(null);
	const [newNumber, setNewNumber] = useState('');
	const categories = [
		"AMC",
		 "New Installation",
		  "Redo",
			 "Recovery",
			  "Removal",
				 "Removal Transfer",
				  "Transfer",
					 "OwnerShipChange"
					];
  const form = useForm({
    initialValues: {
      Sale_Person_name: "",
      Vehicle: "",
      PartyName: "",
      Category: "",
      Device: "",
      Package: "",
      Subscription_Amount: "",
      Amount_Received: "",
      Saleperson_FixedPrice: "",
      Pending_Payment: "",
      Pending_Recovery: "",
      City: "",
      Account_Title_SalePerson: "",
			Account_Title_Number:"",
      Sale_Person_Remarks: "",
      Technician_Person_name: "",
      Technicianperson_Price: "",
      Travelling_Expense_Technician: "",
      Account_Title_SalePerson_TechnicianPerson: "",
      Technician_Person_Remarks: "",
      indate: "",
      status: 0,
    },
  });

  // Fetch dropdown data for select inputs
	// Fetch dropdown data for select inputs
	const fetchDropdownData = async () => {
		try {
			const [
				salespersonResponse,
				technicianResponse,
				deviceResponse,
				packageResponse,
				cityResponse,
				accountResponse,
				numberResponse,
			] = await Promise.all([
				axios.get(`${API_BASE_URL}/api/saleperson/get-sale`),
				axios.get(`${API_BASE_URL}/api/technician/get-technician`),
				axios.get(`${API_BASE_URL}/api/device/get-device`),
				axios.get(`${API_BASE_URL}/api/package/get-Package`),
				axios.get(`${API_BASE_URL}/api/city/get-city`),
				axios.get(`${API_BASE_URL}/api/accountincome/get-Account-Title-Income`),
				axios.get(`${API_BASE_URL}/api/accountincome/get-Account-Number-Income`),
			]);

			setSalespersons(
				salespersonResponse.data.records.map((person: any) => ({
					value: person.Sale_Person_name || "N/A",
					label: person.Sale_Person_name || "N/A",
				}))
			);

			setTechnicians(
				technicianResponse.data.records.map((tech: any) => ({
					value: tech.Technician_Person_name || "N/A",
					label: tech.Technician_Person_name || "N/A",
				}))
			);

			setDevices(
				deviceResponse.data.getdevice.map((device: any) => ({
					value: device.Device || "N/A",
					label: device.Device || "N/A",
				}))
			);

			setPackages(
				packageResponse.data.getpackage.map((pkg: any) => ({
					value: pkg.Package || "N/A",
					label: pkg.Package || "N/A",
				}))
			);

			setCities(
				cityResponse.data.getcity.map((city: any) => ({
					value: city.City || "N/A",
					label: city.City || "N/A",
				}))
			);

			setAccounts(
				accountResponse.data.getaccount.map((account: any) => ({
					value: account.AccountTitleIncome || "N/A",
					label: account.AccountTitleIncome || "N/A",
				}))
			);
			setNumbers(
				(numberResponse.data.getnumber || []).map((number: any) => ({
					value: number.AccountIncomeNumber || "N/A",
					label: number.AccountIncomeNumber || "N/A",
				}))
			);
		} catch (error) {
			console.error("Error fetching dropdown data:", error);
			setError("Failed to load dropdown data.");
		}
	};

	useEffect(() => {
		fetchDropdownData();
	}, []);

// Auto-populate form on data load
useEffect(() => {
  if (incomeData) {
    form.setValues({
      ...incomeData,
      indate: incomeData.indate ? new Date(incomeData.indate).toISOString().split("T")[0] : "",
    });
    setSelectedCategory(incomeData.Category || ""); // Ensure the selected category is set.
  }
}, [incomeData]);

	const handleSubmit = async (values: typeof form.values) => {
		try {
			const response = await axios.put(
				`${API_BASE_URL}/api/income/update-income/${incomeData._id}`,
				values
			);
			onUpdateIncome(response.data.updatedIncome);
			form.reset();
			onClose();
		} catch (err) {
			console.error("Error updating income:", err);
		}
	};

  const openModal = (type: string) => {
    switch (type) {
      case "device":
        // Open device modal
        break;
      case "city":
        // Open city modal
        break;
      case "package":
        // Open package modal
        break;
      case "account":
        // Open account modal
        break;
      default:
        break;
    }
  };

  return (
<Drawer opened={opened} onClose={onClose} title="Edit Income" padding="xl" size="lg">
  <form onSubmit={form.onSubmit(handleSubmit)}>


    {selectedCategory === "New Installation" && (
      <Stack gap="sm">
				 <TextInput
      label="Date"
      type="date"
      {...form.getInputProps("indate")} // Fetch value from form state
    />

    <Select
      label="Category"
      data={categories} // Category options loaded dynamically
      value={form.values.Category || ""} // Prepopulate with form value or fallback to empty string
      onChange={(value) => {
        form.setFieldValue("Category", value || ""); // Update form state
        setSelectedCategory(value || ""); // Update selected category state
      }}
    />
       <Select
					label="Sale Person Name"
					required
					searchable
					data={salespersons}
					{...form.getInputProps("Sale_Person_name")}
				/>
        <TextInput label="Vehicle" required {...form.getInputProps("Vehicle")} />
        <TextInput label="Party Name" required {...form.getInputProps("PartyName")} />
				<Select
					label="Device"
					searchable
					data={[...devices, { value: "add-new", label: "Add New" }]}
					value={form.values.Device || ""}
					onChange={(value) => {
						if (value === "add-new") openModal("device");
						else form.setFieldValue("Device", value || "");
					}}
				/>
        <Select
          label="Package"
          searchable
          data={[...packages, { value: "add-new", label: "Add New" }]}
          value={form.values.Package || ""}
          onChange={(value) => {
            if (value === "add-new") openModal("package");
            else form.setFieldValue("Package", value || "");
          }}
        />
        <NumberInput label="Subscription Amount" {...form.getInputProps("Subscription_Amount")} />
        <NumberInput label="Amount Received" {...form.getInputProps("Amount_Received")} />
        <NumberInput label="Salesperson Fixed Price" {...form.getInputProps("Saleperson_FixedPrice")} />
        <Select
          label="City"
          searchable
          data={[...cities, { value: "add-new", label: "Add New" }]}
          value={form.values.City || ""}
          onChange={(value) => {
            if (value === "add-new") openModal("city");
            else form.setFieldValue("City", value || "");
          }}
        />
        <Select
          label="Title Transaction"
          searchable
          data={[...accounts, { value: "add-new", label: "Add New" }]}
          value={form.values.Account_Title_SalePerson || ""}
          onChange={(value) => {
            if (value === "add-new") openModal("account");
            else form.setFieldValue("Account_Title_SalePerson", value || "");
          }}
        />
				<Select
						label="Account Number"
						searchable
						placeholder="Enter Account Number (e.g., 123)"
						data={[...numbers, { value: 'add-new', label: 'Add New' }]}
						value={form.values.Account_Title_Number || ""} // Ensure it's always a string
						onChange={(value) => {
							if (value === 'add-new') {
								openModal('numbers'); // Open modal when "Add New" is selected
							} else {
								form.setFieldValue('Account_Title_Number', value || ""); // Set value or fallback to empty string
							}
						}}
					/>

        <Select
          label="Technician Person Name"
          searchable
          data={technicians}
          {...form.getInputProps("Technician_Person_name")}
        />
        <NumberInput label="Installation Expense" {...form.getInputProps("Technicianperson_Price")} />
        <NumberInput label="Travelling Expense" {...form.getInputProps("Travelling_Expense_Technician")} />
        <Textarea label="Remarks" {...form.getInputProps("Technician_Person_Remarks")} />
      </Stack>
    )}

{selectedCategory === "OwnerShipChange" && (
    <Stack gap="sm">
				 <TextInput
      label="Date"
      type="date"
      {...form.getInputProps("indate")} // Fetch value from form state
    />

    <Select
      label="Category"
      data={categories} // Category options loaded dynamically
      value={form.values.Category || ""} // Prepopulate with form value or fallback to empty string
      onChange={(value) => {
        form.setFieldValue("Category", value || ""); // Update form state
        setSelectedCategory(value || ""); // Update selected category state
      }}
    />

<TextInput label="Vehicle" {...form.getInputProps("Vehicle")} />

      <TextInput label="Party Name" required {...form.getInputProps("PartyName")} />
      <NumberInput label="Amount Received" {...form.getInputProps("Amount_Received")} />
      <Select
        label="Title Transaction"
        searchable
        data={[...accounts, { value: "add-new", label: "Add New" }]}
        {...form.getInputProps("Account_Title_SalePerson")}
      />
			<Select
						label="Account Number"
						searchable
						placeholder="Enter Account Number (e.g., 123)"
						data={[...numbers, { value: 'add-new', label: 'Add New' }]}
						value={form.values.Account_Title_Number || ""} // Ensure it's always a string
						onChange={(value) => {
							if (value === 'add-new') {
								openModal('numbers'); // Open modal when "Add New" is selected
							} else {
								form.setFieldValue('Account_Title_Number', value || ""); // Set value or fallback to empty string
							}
						}}
					/>
      <Textarea label="Remarks" {...form.getInputProps("Technician_Person_Remarks")} />
    </Stack>
  )}

{selectedCategory === "AMC" && (
    <Stack gap="sm">
				 <TextInput
      label="Date"
      type="date"
      {...form.getInputProps("indate")} // Fetch value from form state
    />

    <Select
      label="Category"
      data={categories} // Category options loaded dynamically
      value={form.values.Category || ""} // Prepopulate with form value or fallback to empty string
      onChange={(value) => {
        form.setFieldValue("Category", value || ""); // Update form state
        setSelectedCategory(value || ""); // Update selected category state
      }}
    />

<TextInput label="Vehicle" {...form.getInputProps("Vehicle")} />

      <TextInput label="Party Name" required {...form.getInputProps("PartyName")} />
      <Select
        label="Device"
        searchable
        data={[...devices, { value: "add-new", label: "Add New" }]}
        {...form.getInputProps("Device")}
      />
      <Select
        label="Package"
        searchable
        data={[...packages, { value: "add-new", label: "Add New" }]}
        {...form.getInputProps("Package")}
      />
      <NumberInput label="Subscription Amount" {...form.getInputProps("Subscription_Amount")} />
      <NumberInput label="Amount Received" {...form.getInputProps("Amount_Received")} />
      <Select
        label="City"
        searchable
        data={[...cities, { value: "add-new", label: "Add New" }]}
        {...form.getInputProps("City")}
      />
      <Select
        label="Title Transaction"
        searchable
        data={[...accounts, { value: "add-new", label: "Add New" }]}
        {...form.getInputProps("Account_Title_SalePerson")}
      />
			<Select
						label="Account Number"
						searchable
						placeholder="Enter Account Number (e.g., 123)"
						data={[...numbers, { value: 'add-new', label: 'Add New' }]}
						value={form.values.Account_Title_Number || ""} // Ensure it's always a string
						onChange={(value) => {
							if (value === 'add-new') {
								openModal('numbers'); // Open modal when "Add New" is selected
							} else {
								form.setFieldValue('Account_Title_Number', value || ""); // Set value or fallback to empty string
							}
						}}
					/>
      <Textarea label="Remarks" {...form.getInputProps("Technician_Person_Remarks")} />
    </Stack>
  )}

{selectedCategory === "Redo" && (
  <Stack gap="sm">
			 <TextInput
      label="Date"
      type="date"
      {...form.getInputProps("indate")} // Fetch value from form state
    />

    <Select
      label="Category"
      data={categories} // Category options loaded dynamically
      value={form.values.Category || ""} // Prepopulate with form value or fallback to empty string
      onChange={(value) => {
        form.setFieldValue("Category", value || ""); // Update form state
        setSelectedCategory(value || ""); // Update selected category state
      }}
    />

 <TextInput label="Vehicle" {...form.getInputProps("Vehicle")} />

    <TextInput label="Party Name" required {...form.getInputProps("PartyName")} />
    <Select
      label="Device"
      searchable
      data={[...devices, { value: "add-new", label: "Add New" }]}
      {...form.getInputProps("Device")}
    />
    <Select
      label="Package"
      searchable
      data={[...packages, { value: "add-new", label: "Add New" }]}
      {...form.getInputProps("Package")}
    />
    <Select
      label="City"
      searchable
      data={[...cities, { value: "add-new", label: "Add New" }]}
      {...form.getInputProps("City")}
    />
    <NumberInput label="Subscription Amount" {...form.getInputProps("Subscription_Amount")} />
    <NumberInput label="Amount Received" {...form.getInputProps("Amount_Received")} />
    <Select
      label="Title Transaction"
      searchable
      data={[...accounts, { value: "add-new", label: "Add New" }]}
      {...form.getInputProps("Account_Title_SalePerson")}
    />
		<Select
						label="Account Number"
						searchable
						placeholder="Enter Account Number (e.g., 123)"
						data={[...numbers, { value: 'add-new', label: 'Add New' }]}
						value={form.values.Account_Title_Number || ""} // Ensure it's always a string
						onChange={(value) => {
							if (value === 'add-new') {
								openModal('numbers'); // Open modal when "Add New" is selected
							} else {
								form.setFieldValue('Account_Title_Number', value || ""); // Set value or fallback to empty string
							}
						}}
					/>
    <Select
      label="Technician Person Name"
      searchable
      data={technicians}
      {...form.getInputProps("Technician_Person_name")}
    />
    <NumberInput label="Redo Expense" {...form.getInputProps("Technicianperson_Price")} />
    <NumberInput
      label="Travelling Expense"
      {...form.getInputProps("Travelling_Expense_Technician")}
    />
    <Textarea label="Remarks" {...form.getInputProps("Technician_Person_Remarks")} />
  </Stack>
)}

			 {/* Render fields conditionally based on the selected category */}
			 {selectedCategory === "Recovery" && (
        <Stack gap="sm">
						 <TextInput
      label="Date"
      type="date"
      {...form.getInputProps("indate")} // Fetch value from form state
    />

    <Select
      label="Category"
      data={categories} // Category options loaded dynamically
      value={form.values.Category || ""} // Prepopulate with form value or fallback to empty string
      onChange={(value) => {
        form.setFieldValue("Category", value || ""); // Update form state
        setSelectedCategory(value || ""); // Update selected category state
      }}
    />
       <Select
					label="Sale Person Name"
					required
					searchable
					data={salespersons}
					{...form.getInputProps("Sale_Person_name")}
				/>
 <TextInput label="Vehicle" {...form.getInputProps("Vehicle")} />
        <TextInput label="Party Name" required {...form.getInputProps("PartyName")} />
        <Select
      label="Device"
      searchable
      data={[...devices, { value: "add-new", label: "Add New" }]}
      {...form.getInputProps("Device")}
    />
    <Select
      label="Package"
      searchable
      data={[...packages, { value: "add-new", label: "Add New" }]}
      {...form.getInputProps("Package")}
    />
  <Select
      label="City"
      searchable
      data={[...cities, { value: "add-new", label: "Add New" }]}
      {...form.getInputProps("City")}
    />
				<NumberInput label="Subscription Amount" {...form.getInputProps("Subscription_Amount")} />
        <NumberInput label="Amount Received" {...form.getInputProps("Amount_Received")} />
        <NumberInput label="Saleperson Fixed Price" {...form.getInputProps("Saleperson_FixedPrice")} />
        <NumberInput label="Pending Payment" {...form.getInputProps("Pending_Payment")} />
        <NumberInput label="Pending Recovery" {...form.getInputProps("Pending_Recovery")} />
          <Select
            label="Title Transaction"
            searchable
            data={[...accounts, { value: 'add-new', label: 'Add New' }]}
            value={form.values.Account_Title_SalePerson || ""} // Ensure it's always a string
            onChange={(value) => {
              if (value === 'add-new') {
                openModal('account'); // Open modal when "Add New" is selected
              } else {
                form.setFieldValue('Account_Title_SalePerson', value || ""); // Set value or fallback to empty string
              }
            }}
          />
					<Select
						label="Account Number"
						searchable
						placeholder="Enter Account Number (e.g., 123)"
						data={[...numbers, { value: 'add-new', label: 'Add New' }]}
						value={form.values.Account_Title_Number || ""} // Ensure it's always a string
						onChange={(value) => {
							if (value === 'add-new') {
								openModal('numbers'); // Open modal when "Add New" is selected
							} else {
								form.setFieldValue('Account_Title_Number', value || ""); // Set value or fallback to empty string
							}
						}}
					/>

        <Textarea
          label="Remarks"
          {...form.getInputProps("Technician_Person_Remarks")}
        />
        </Stack>
      )}

					 {/* Render fields conditionally based on the selected category */}
					 {selectedCategory === "Removal" && (
        <Stack gap="sm">
						 <TextInput
      label="Date"
      type="date"
      {...form.getInputProps("indate")} // Fetch value from form state
    />

    <Select
      label="Category"
      data={categories} // Category options loaded dynamically
      value={form.values.Category || ""} // Prepopulate with form value or fallback to empty string
      onChange={(value) => {
        form.setFieldValue("Category", value || ""); // Update form state
        setSelectedCategory(value || ""); // Update selected category state
      }}
    />

 <TextInput label="Vehicle" {...form.getInputProps("Vehicle")} />
        <TextInput label="Party Name" required {...form.getInputProps("PartyName")} />
				<Select
            label="Device"
            searchable
            data={[...devices, { value: 'add-new', label: 'Add New' }]}
            value={form.values.Device || ""} // Ensure it's always a string
            onChange={(value) => {
              if (value === 'add-new') {
                openModal('device'); // Open modal when "Add New" is selected
              } else {
                form.setFieldValue('Device', value || ""); // Set value or fallback to empty string
              }
            }}
          />

           <Select
            label="Package"
            searchable
            data={[...packages, { value: 'add-new', label: 'Add New' }]}
            value={form.values.Package || ""} // Ensure it's always a string
            onChange={(value) => {
              if (value === 'add-new') {
                openModal('package'); // Open modal when "Add New" is selected
              } else {
                form.setFieldValue('Package', value || ""); // Set value or fallback to empty string
              }
            }}
          />

        <NumberInput label="Amount Received" {...form.getInputProps("Amount_Received")} />

				<Select
            label="City"
            searchable
            data={[...cities, { value: 'add-new', label: 'Add New' }]}
            value={form.values.City || ""} // Ensure it's always a string
            onChange={(value) => {
              if (value === 'add-new') {
                openModal('city'); // Open modal when "Add New" is selected
              } else {
                form.setFieldValue('City', value || ""); // Set value or fallback to empty string
              }
            }}
          />

          <Select
            label="Title Transaction"
            searchable
            data={[...accounts, { value: 'add-new', label: 'Add New' }]}
            value={form.values.Account_Title_SalePerson || ""} // Ensure it's always a string
            onChange={(value) => {
              if (value === 'add-new') {
                openModal('account'); // Open modal when "Add New" is selected
              } else {
                form.setFieldValue('Account_Title_SalePerson', value || ""); // Set value or fallback to empty string
              }
            }}
          />
					<Select
						label="Account Number"
						searchable
						placeholder="Enter Account Number (e.g., 123)"
						data={[...numbers, { value: 'add-new', label: 'Add New' }]}
						value={form.values.Account_Title_Number || ""} // Ensure it's always a string
						onChange={(value) => {
							if (value === 'add-new') {
								openModal('numbers'); // Open modal when "Add New" is selected
							} else {
								form.setFieldValue('Account_Title_Number', value || ""); // Set value or fallback to empty string
							}
						}}
					/>
					  <Select
          label="Technician Person Name"
          searchable
          data={technicians}
          {...form.getInputProps("Technician_Person_name")}
        />
        <NumberInput
          label="Removal Expanse"
          {...form.getInputProps("Technicianperson_Price")}
        />
        <NumberInput
          label="Travelling Expense"
          {...form.getInputProps("Travelling_Expense_Technician")}
        />

        <Textarea
          label="Remarks"
          {...form.getInputProps("Technician_Person_Remarks")}
        />
        </Stack>
      )}

					 {/* Render fields conditionally based on the selected category */}
					 {selectedCategory === "Removal Transfer" && (
        <Stack gap="sm">
						 <TextInput
      label="Date"
      type="date"
      {...form.getInputProps("indate")} // Fetch value from form state
    />

    <Select
      label="Category"
      data={categories} // Category options loaded dynamically
      value={form.values.Category || ""} // Prepopulate with form value or fallback to empty string
      onChange={(value) => {
        form.setFieldValue("Category", value || ""); // Update form state
        setSelectedCategory(value || ""); // Update selected category state
      }}
    />

<TextInput label="Vehicle" {...form.getInputProps("Vehicle")} />
        <TextInput label="Party Name" required {...form.getInputProps("PartyName")} />
				<Select
            label="Device"
            searchable
            data={[...devices, { value: 'add-new', label: 'Add New' }]}
            value={form.values.Device || ""} // Ensure it's always a string
            onChange={(value) => {
              if (value === 'add-new') {
                openModal('device'); // Open modal when "Add New" is selected
              } else {
                form.setFieldValue('Device', value || ""); // Set value or fallback to empty string
              }
            }}
          />

           <Select
            label="Package"
            searchable
            data={[...packages, { value: 'add-new', label: 'Add New' }]}
            value={form.values.Package || ""} // Ensure it's always a string
            onChange={(value) => {
              if (value === 'add-new') {
                openModal('package'); // Open modal when "Add New" is selected
              } else {
                form.setFieldValue('Package', value || ""); // Set value or fallback to empty string
              }
            }}
          />
	<Select
            label="City"
            searchable
            data={[...cities, { value: 'add-new', label: 'Add New' }]}
            value={form.values.City || ""} // Ensure it's always a string
            onChange={(value) => {
              if (value === 'add-new') {
                openModal('city'); // Open modal when "Add New" is selected
              } else {
                form.setFieldValue('City', value || ""); // Set value or fallback to empty string
              }
            }}
          />

        <NumberInput label="Amount Received" {...form.getInputProps("Amount_Received")} />

          <Select
            label="Title Transaction"
            searchable
            data={[...accounts, { value: 'add-new', label: 'Add New' }]}
            value={form.values.Account_Title_SalePerson || ""} // Ensure it's always a string
            onChange={(value) => {
              if (value === 'add-new') {
                openModal('account'); // Open modal when "Add New" is selected
              } else {
                form.setFieldValue('Account_Title_SalePerson', value || ""); // Set value or fallback to empty string
              }
            }}
          />
					<Select
						label="Account Number"
						searchable
						placeholder="Enter Account Number (e.g., 123)"
						data={[...numbers, { value: 'add-new', label: 'Add New' }]}
						value={form.values.Account_Title_Number || ""} // Ensure it's always a string
						onChange={(value) => {
							if (value === 'add-new') {
								openModal('numbers'); // Open modal when "Add New" is selected
							} else {
								form.setFieldValue('Account_Title_Number', value || ""); // Set value or fallback to empty string
							}
						}}
					/>

				<Select
          label="Technician Person Name"
          searchable
          data={technicians}
          {...form.getInputProps("Technician_Person_name")}
        />
        <NumberInput
          label="Removal Transfer Expanse"
          {...form.getInputProps("Technicianperson_Price")}
        />
        <NumberInput
          label="Travelling Expense"
          {...form.getInputProps("Travelling_Expense_Technician")}
        />

        <Textarea
          label="Remarks"
          {...form.getInputProps("Technician_Person_Remarks")}
        />
        </Stack>
      )}

					 {/* Render fields conditionally based on the selected category */}
					 {selectedCategory === "Transfer" && (
        <Stack gap="sm">
						 <TextInput
      label="Date"
      type="date"
      {...form.getInputProps("indate")} // Fetch value from form state
    />

    <Select
      label="Category"
      data={categories} // Category options loaded dynamically
      value={form.values.Category || ""} // Prepopulate with form value or fallback to empty string
      onChange={(value) => {
        form.setFieldValue("Category", value || ""); // Update form state
        setSelectedCategory(value || ""); // Update selected category state
      }}
    />

<TextInput label="Vehicle" {...form.getInputProps("Vehicle")} />
        <TextInput label="Party Name" required {...form.getInputProps("PartyName")} />
				<Select
            label="Device"
            searchable
            data={[...devices, { value: 'add-new', label: 'Add New' }]}
            value={form.values.Device || ""} // Ensure it's always a string
            onChange={(value) => {
              if (value === 'add-new') {
                openModal('device'); // Open modal when "Add New" is selected
              } else {
                form.setFieldValue('Device', value || ""); // Set value or fallback to empty string
              }
            }}
          />

           <Select
            label="Package"
            searchable
            data={[...packages, { value: 'add-new', label: 'Add New' }]}
            value={form.values.Package || ""} // Ensure it's always a string
            onChange={(value) => {
              if (value === 'add-new') {
                openModal('package'); // Open modal when "Add New" is selected
              } else {
                form.setFieldValue('Package', value || ""); // Set value or fallback to empty string
              }
            }}
          />

        <NumberInput label="Amount Received" {...form.getInputProps("Amount_Received")} />

				<Select
            label="City"
            searchable
            data={[...cities, { value: 'add-new', label: 'Add New' }]}
            value={form.values.City || ""} // Ensure it's always a string
            onChange={(value) => {
              if (value === 'add-new') {
                openModal('city'); // Open modal when "Add New" is selected
              } else {
                form.setFieldValue('City', value || ""); // Set value or fallback to empty string
              }
            }}
          />

          <Select
            label="Title Transaction"
            searchable
            data={[...accounts, { value: 'add-new', label: 'Add New' }]}
            value={form.values.Account_Title_SalePerson || ""} // Ensure it's always a string
            onChange={(value) => {
              if (value === 'add-new') {
                openModal('account'); // Open modal when "Add New" is selected
              } else {
                form.setFieldValue('Account_Title_SalePerson', value || ""); // Set value or fallback to empty string
              }
            }}
          />
					<Select
						label="Account Number"
						searchable
						placeholder="Enter Account Number (e.g., 123)"
						data={[...numbers, { value: 'add-new', label: 'Add New' }]}
						value={form.values.Account_Title_Number || ""} // Ensure it's always a string
						onChange={(value) => {
							if (value === 'add-new') {
								openModal('numbers'); // Open modal when "Add New" is selected
							} else {
								form.setFieldValue('Account_Title_Number', value || ""); // Set value or fallback to empty string
							}
						}}
					/>
					  <Select
          label="Technician Person Name"
          searchable
          data={technicians}
          {...form.getInputProps("Technician_Person_name")}
        />
        <NumberInput
          label="Transfer Expanse"
          {...form.getInputProps("Technicianperson_Price")}
        />
        <NumberInput
          label="Travelling Expense"
          {...form.getInputProps("Travelling_Expense_Technician")}
        />

        <Textarea
          label="Remarks"
          {...form.getInputProps("Technician_Person_Remarks")}
        />
        </Stack>
      )}

        <Space h="md" />
        <Button type="submit" fullWidth>
          Update Income
        </Button>
      </form>
    </Drawer>
	)}


