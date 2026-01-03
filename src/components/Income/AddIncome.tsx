"use client";

import { useState, useEffect } from "react";
import { Button, Drawer, TextInput, Select, Modal, Alert,NumberInput, Textarea,  Space,Stack,  } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary
import { toast } from "react-toastify"; // Import toast
interface DropdownOption {
  value: string;
  label: string;
}
interface AddIncomeProps {
  opened: boolean;
  onClose: () => void;
  onAddIncome: (newIncome: any) => void;
}
export const AddIncome = ({ opened, onClose, onAddIncome }: AddIncomeProps) => {
  const [salespersons, setSalespersons] = useState<DropdownOption[]>([]);
  const [technicians, setTechnicians] = useState<DropdownOption[]>([]);
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
  const [devices,     setDevices] = useState<DropdownOption[]>([]);
  const [packages,    setPackages] = useState<DropdownOption[]>([]);
  const [cities,      setCities] = useState<DropdownOption[]>([]);
  const [accounts,    setAccounts] = useState<DropdownOption[]>([]);
	const [numbers,    setNumbers] = useState<DropdownOption[]>([]);
  const [isLoading,   setIsLoading] = useState(false);
	const [fixedPrice, setFixedPrice] = useState<number | null>(null);
  const [error,       setError] = useState<string | null>(null);
  const [openDeviceModal, setOpenDeviceModal] = useState(false);
	const [readOnly, setReadOnly] = useState(true);
  const [openCityModal, setOpenCityModal] = useState(false);
  const [openPackageModal, setOpenPackageModal] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState(false);
	const [openNumberModal, setOpenNumberModal] = useState(false);

	const [vehicleInput, setVehicleInput] = useState(""); // Local input state
  const [vehicleLoading, setVehicleLoading] = useState(false); // Loading state
  const [newDevice, setNewDevice] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPackage, setNewPackage] = useState('');
  const [newAccount, setNewAccount] = useState('');
	const [newNumber, setNewNumber] = useState('');

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
			Excess_Amount:"",
      Pending_Recovery: "",
			Inofcsaleperson:"",
      City: "",
      Account_Title_SalePerson: "",
			Account_Title_Number:"",
			AccountNum: "",
      Sale_Person_Remarks: "",
			Techniciancost:"",
			Technicianfuel:"",
      Technician_Person_name: "",
      Technicianperson_Price: "",
      Travelling_Expense_Technician: "",
      Technician_Person_Remarks: "",
			Total_Amount:"",
      indate: "",
      status: 0,
    },

  });

	useEffect(() => {
    if (form.values.Category === "New Installation") {
      form.setValues({ Pending_Payment: "1000" });
    } else {
      form.setValues({ Pending_Payment: "0" }); // Reset if another category is chosen
    }
  }, [form.values.Category]);


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
				(salespersonResponse.data.records || []).map((person: any) => ({
					value: person.Sale_Person_name || "N/A",
					label: person.Sale_Person_name || "N/A",
				}))
			);

			setTechnicians(
				(technicianResponse.data.records || []).map((tech: any) => ({
					value: tech.Technician_Person_name || "N/A",
					label: tech.Technician_Person_name || "N/A",
				}))
			);

			setDevices(
				(deviceResponse.data.getdevice || []).map((device: any) => ({
					value: device.Device || "N/A",
					label: device.Device || "N/A",
				}))
			);

			setPackages(
				(packageResponse.data.getpackage || []).map((pkg: any) => ({
					value: pkg.Package || "N/A",
					label: pkg.Package || "N/A",
				}))
			);

			setCities(
				(cityResponse.data.getcity || []).map((city: any) => ({
					value: city.City || "N/A",
					label: city.City || "N/A",
				}))
			);

			setAccounts(
				(accountResponse.data.getaccount || []).map((account: any) => ({
					value: account.AccountTitleIncome || "N/A",
					label: account.AccountTitleIncome || "N/A",
				}))
			);

			// Map account numbers correctly
			setNumbers(
				(numberResponse.data.getnumber || []).map((number: any) => ({
					value: number.AccountIncomeNumber || "N/A",
					label: number.AccountIncomeNumber || "N/A",
				}))
			);

			console.log("Fetched Account Numbers:", numberResponse.data.getnumber); // Debugging fetched data
		} catch (error) {
			console.error("Error fetching dropdown data:", error);
		}
	};

	//get new installation
	useEffect(() => {
    const fetchFixedPriceData = async () => {
      if (!form.values.Sale_Person_name || !form.values.Package) {
        form.setFieldValue("Saleperson_FixedPrice", ""); // Clear previous value if no selection
        return;
      }

      try {
        setIsLoading(true);
        form.setFieldValue("Saleperson_FixedPrice", ""); // Clear before fetching new data

        const response = await axios.get(
          `${API_BASE_URL}/api/income/get-Fixedprice-by-Salepersonperson/${encodeURIComponent(form.values.Sale_Person_name)}/${encodeURIComponent(form.values.Package)}`
        );

        const fixedPriceData = response.data;
        console.log("Fetched Fixed Price:", fixedPriceData);

        form.setFieldValue("Saleperson_FixedPrice", fixedPriceData.Fixed_Package_Amount || "");
      } catch (error: any) {
        console.error("Error fetching fixed price data:", error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFixedPriceData();
  }, [form.values.Sale_Person_name, form.values.Package]); // Runs when either changes


//get amc
const handleVehicleamcInputChange = (value: string) => {
  setVehicleInput(value); // Allow all types of input formats
  fetchVehicleamcData(value); // Trigger data fetch
};

const fetchVehicleamcData = async (value: string) => {
  if (!value) return; // Don't fetch if input is empty

  try {
    setVehicleLoading(true);

    // Fetch data from the backend
    const response = await axios.get(
      `${API_BASE_URL}/api/income/get-single-Vehicle/${encodeURIComponent(value)}`
    );

    const vehicleData = response.data;

    // Update form with data from the API
    form.setValues({
      ...form.values,
      Vehicle: value, // Keep the original input value
      Sale_Person_name: vehicleData.Sale_Person_name || "",
      PartyName: vehicleData.PartyName || "",
			Device: vehicleData.Device || "",
			Package: vehicleData.Package || "",
      Subscription_Amount: vehicleData.Subscription_Amount || 0,
      City: vehicleData.City || "",
    });
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.error("Vehicle not found.");
    } else {
      console.error("Error fetching vehicle data:", error.message);
    }
  } finally {
    setVehicleLoading(false);
  }
};

//GET REDO
// Function to handle input changes and call the API
const handleVehicleredoInputChange = (value: string) => {
  setVehicleInput(value); // Allow all types of input formats
  fetchVehicleredoData(value); // Trigger data fetch
};

const fetchVehicleredoData = async (value: string) => {
  if (!value) return; // Don't fetch if input is empty

  try {
    setVehicleLoading(true);

    // Fetch data from the backend
    const response = await axios.get(
      `${API_BASE_URL}/api/income/get-single-Vehicle/${encodeURIComponent(value)}`
    );

    const vehicleData = response.data;

    // Update form with data from the API
    form.setValues({
      ...form.values,
      Vehicle: value, // Keep the original input value
      Sale_Person_name: vehicleData.Sale_Person_name || "",
      PartyName: vehicleData.PartyName || "",
      Subscription_Amount: vehicleData.Subscription_Amount || 0,
      City: vehicleData.City || "",
    });
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.error("Vehicle not found.");
    } else {
      console.error("Error fetching vehicle data:", error.message);
    }
  } finally {
    setVehicleLoading(false);
  }
};

//get recovery
const handleVehiclerecoveryInputChange = (value: string) => {
  setVehicleInput(value); // Allow all types of input formats
  fetchVehiclerecoveryData(value); // Trigger data fetch
};

const fetchVehiclerecoveryData = async (value: string) => {
  if (!value) return; // Don't fetch if input is empty

  try {
    setVehicleLoading(true);

    // Fetch data from the backend
    const response = await axios.get(
      `${API_BASE_URL}/api/income/get-single-Vehicle/${encodeURIComponent(value)}`
     );

    const vehicleData = response.data;

    // Update form with data from the API
    form.setValues({
      ...form.values,
      Vehicle: value, // Keep the original input value
      Sale_Person_name: vehicleData.Sale_Person_name || "",
      PartyName: vehicleData.PartyName || "",
			Device: vehicleData.Device || "",
			Package: vehicleData.Package || "",
      Amount_Received: vehicleData.Amount_Received || 0,
      Saleperson_FixedPrice: vehicleData.Saleperson_FixedPrice || 0,
      Pending_Payment: vehicleData.Pending_Payment || 0,
      Subscription_Amount: vehicleData.Subscription_Amount || 0,
      City: vehicleData.City || "",
    });
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.error("Vehicle not found.");
    } else {
      console.error("Error fetching vehicle data:", error.message);
    }
  } finally {
    setVehicleLoading(false);
  }
};

		//get removal
    const handleVehicleremovalInputChange = (value: string) => {
      setVehicleInput(value); // Allow all types of input formats
      fetchVehicleremovalData(value); // Trigger data fetch
    };

    const fetchVehicleremovalData = async (value: string) => {
      if (!value) return; // Don't fetch if input is empty

      try {
        setVehicleLoading(true);

        // Fetch data from the backend
        const response = await axios.get(
          `${API_BASE_URL}/api/income/get-single-Vehicle/${encodeURIComponent(value)}`
        );

        const vehicleData = response.data;

        // Update form with data from the API
        form.setValues({
          ...form.values,
          Vehicle: value, // Keep the original input value
          Sale_Person_name: vehicleData.Sale_Person_name || "",
          PartyName: vehicleData.PartyName || "",
          Device: vehicleData.Device || "",
          Package: vehicleData.Package || "",
          Subscription_Amount: vehicleData.Subscription_Amount || 0,
          City: vehicleData.City || "",
        });
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.error("Vehicle not found.");
        } else {
          console.error("Error fetching vehicle data:", error.message);
        }
      } finally {
        setVehicleLoading(false);
      }
    };
    //get transfer

    const handleVehicletransferInputChange = (value: string) => {
      setVehicleInput(value); // Allow all types of input formats
      fetchVehicletransferData(value); // Trigger data fetch
    };

    const fetchVehicletransferData = async (value: string) => {
      if (!value) return; // Don't fetch if input is empty

      try {
        setVehicleLoading(true);

        // Fetch data from the backend
        const response = await axios.get(
          `${API_BASE_URL}/api/income/get-single-Vehicle/${encodeURIComponent(value)}`
        );

        const vehicleData = response.data;

        // Update form with data from the API
        form.setValues({
          ...form.values,
          Vehicle: value, // Keep the original input value
          Sale_Person_name: vehicleData.Sale_Person_name || "",
          PartyName: vehicleData.PartyName || "",
          Device: vehicleData.Device || "",
          Package: vehicleData.Package || "",
          Subscription_Amount: vehicleData.Subscription_Amount || 0,
          City: vehicleData.City || "",
        });
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.error("Vehicle not found.");
        } else {
          console.error("Error fetching vehicle data:", error.message);
        }
      } finally {
        setVehicleLoading(false);
      }
    };

				//get removal transfer
        const handleVehicleretransfarInputChange = (value: string) => {
          setVehicleInput(value); // Allow all types of input formats
          fetchVehicleremtransfarData(value); // Trigger data fetch
        };

        const fetchVehicleremtransfarData = async (value: string) => {
          if (!value) return; // Don't fetch if input is empty

          try {
            setVehicleLoading(true);

            // Fetch data from the backend
            const response = await axios.get(
              `${API_BASE_URL}/api/income/get-single-Vehicle/${encodeURIComponent(value)}`
            );

            const vehicleData = response.data;

            // Update form with data from the API
            form.setValues({
              ...form.values,
              Vehicle: value, // Keep the original input value
              Sale_Person_name: vehicleData.Sale_Person_name || "",
              PartyName: vehicleData.PartyName || "",
              Device: vehicleData.Device || "",
              Package: vehicleData.Package || "",
              Subscription_Amount: vehicleData.Subscription_Amount || 0,
              City: vehicleData.City || "",
            });
          } catch (error: any) {
            if (error.response && error.response.status === 404) {
              console.error("Vehicle not found.");
            } else {
              console.error("Error fetching vehicle data:", error.message);
            }
          } finally {
            setVehicleLoading(false);
          }
        };

	//get ownership change
  const handleVehicleownershipchangeInputChange = (value: string) => {
    setVehicleInput(value); // Allow all types of input formats
    fetchVehicleownershipchangeData(value); // Trigger data fetch
  };

  const fetchVehicleownershipchangeData = async (value: string) => {
    if (!value) return; // Don't fetch if input is empty

    try {
      setVehicleLoading(true);

      // Fetch data from the backend
      const response = await axios.get(
        `${API_BASE_URL}/api/income/get-single-Vehicle/${encodeURIComponent(value)}`
      );

      const vehicleData = response.data;

      // Update form with data from the API
      form.setValues({
        ...form.values,
        Vehicle: value, // Keep the original input value
        City: vehicleData.City || "",
      });
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.error("Vehicle not found.");
      } else {
        console.error("Error fetching vehicle data:", error.message);
      }
    } finally {
      setVehicleLoading(false);
    }
  };

  useEffect(() => {
		fetchDropdownData();
	}, []);
	useEffect(() => {
		console.log("Numbers state updated:", numbers);
	}, [numbers]);

	const handleNewEntry = async (entry: string, type: string) => {
		try {
			let response;
			if (type === 'Device') {
				response = await axios.post(`${API_BASE_URL}/api/device/create-Device`, { Device: entry });
				setDevices([...devices, { value: entry, label: entry }]);
			} else if (type === 'City') {
				response = await axios.post(`${API_BASE_URL}/api/city/create-City`, { City: entry });
				setCities([...cities, { value: entry, label: entry }]);
			} else if (type === 'package') {
				response = await axios.post(`${API_BASE_URL}/api/package/create-Package`, { Package: entry });
				setPackages([...packages, { value: entry, label: entry }]);
			} else if (type === 'account') {
				response = await axios.post(`${API_BASE_URL}/api/accountincome/create-Account-Title-Income`, { AccountTitleIncome: entry });
				setAccounts([...accounts, { value: entry, label: entry }]);
			} else if (type === 'numbers') {
				response = await axios.post(`${API_BASE_URL}/api/accountincome/create-Account-Number-Income`, { AccountIncomeNumber: entry });
				setNumbers([...numbers, { value: entry, label: entry }]);
			}

			if (response) {
				toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`); // Show success toast
			}
		} catch (error) {
			console.error(`Error adding new ${type}:`, error);
			toast.error('Failed to create new entry. Please try again later.'); // Show error toast
		}
	};

  const openModal = (type: string) => {
    if (type === 'Device') setOpenDeviceModal(true);
    if (type === 'City') setOpenCityModal(true);
    if (type === 'package') setOpenPackageModal(true);
    if (type === 'account') setOpenAccountModal(true);
		if (type === 'numbers') setOpenNumberModal(true);
  };

	// Handle form submission
  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    setError(null);

    if (!values.indate || isNaN(Date.parse(values.indate))) {
      setError("Please enter a valid date.");
      setIsLoading(false);
      return;
    }

    const incomeData = { ...values };

      try {
      const response = await axios.post(
      `${API_BASE_URL}/api/income/create-income`,
        incomeData
      );
      onAddIncome(response.data);
      form.reset();
      onClose();
    } catch (err) {
      setError("Error adding income. Please try again.");
      console.error("Error adding income:", err);
    } finally {
      setIsLoading(false);
    }
  };
	const selectedCategory = form.values.Category;

  return (
    <>
      <Drawer opened={opened} onClose={onClose} title="Add Income" padding="xl" size="sm">
			<form onSubmit={form.onSubmit(handleSubmit)}>
			<TextInput label="Date" type="date" required {...form.getInputProps("indate")} />
       <Select
        label="Category"
        searchable
				placeholder="Enter Category (e.g., New Installation, Redo)"
        data={categories}
        value={selectedCategory || ""} // Ensure fallback for null
        onChange={(value) => form.setFieldValue("Category", value || "")} // Handle null safely
      />
          {error && <Alert color="red">{error}</Alert>}

				 {/* Render fields conditionally based on the selected category */}
				 {selectedCategory === "New Installation" && (
  <Stack gap="sm">
     <Select
			label="In Office Sale Person"
			data={[{ value: "Yes", label: "Yes" },
			{ value: "No", label: "No" }]}
			{...form.getInputProps("Inofcsaleperson")}
			 />

		<Select
      label="Sale Person Name"
      required
      searchable
      placeholder="Enter Sale Person Name"
      data={salespersons}
      value={form.values.Sale_Person_name}
      onChange={(value) => form.setFieldValue("Sale_Person_name", value || "")}
    />

    <TextInput
      label="Vehicle"
      placeholder="Enter Vehicle # (e.g., XYZ-1155)"
      required
      {...form.getInputProps("Vehicle")}
    />

    <TextInput
      label="Party Name"
      placeholder="Enter Party Name (e.g., ABC)"
      required
      {...form.getInputProps("PartyName")}
    />

    <Select
      label="Device"
      searchable
      placeholder="Enter Device (e.g., R16, R31)"
      data={[...devices, { value: 'add-new', label: 'Add New' }]}
      value={form.values.Device || ""}
      onChange={(value) => {
        if (value === 'add-new') {
          openModal('Device');
        } else {
          form.setFieldValue('Device', value || "");
        }
      }}
    />

    <Select
      label="Package"
      searchable
      placeholder="Enter Package (e.g., Deluxe)"
      data={[...packages, { value: 'add-new', label: 'Add New' }]}
      value={form.values.Package || ""}
      onChange={(value) => {
        if (value === 'add-new') {
          openModal('package');
        } else {
          form.setFieldValue('Package', value || "");
        }
      }}
    />

    <NumberInput
      label="Subscription Amount"
      placeholder="Enter Subscription Amount (e.g., 18000)"
      {...form.getInputProps("Subscription_Amount")}
    />

    <NumberInput
      label="Amount Received"
      placeholder="Enter Amount Received (e.g., 18000)"
      {...form.getInputProps("Amount_Received")}
    />

    <NumberInput
      label="Saleperson Fixed Price"
      value={form.values.Saleperson_FixedPrice || ""}
      placeholder="Auto-filled"
      readOnly
    />

    <Select
      label="City"
      searchable
      placeholder="Enter City (e.g., Multan)"
      data={[...cities, { value: 'add-new', label: 'Add New' }]}
      value={form.values.City || ""}
      onChange={(value) => {
        if (value === 'add-new') {
          openModal('City');
        } else {
          form.setFieldValue('City', value || "");
        }
      }}
    />

    <Select
      label="Title Transaction"
      searchable
      placeholder="Enter Title Transaction (e.g., Mux Tech)"
      data={[...accounts, { value: 'add-new', label: 'Add New' }]}
      value={form.values.Account_Title_SalePerson || ""}
      onChange={(value) => {
        if (value === 'add-new') {
          openModal('account');
        } else {
          form.setFieldValue('Account_Title_SalePerson', value || "");
        }
      }}
    />

    <Select
      label="Account Number"
      searchable
      placeholder="Enter Account Number (e.g., 123)"
      data={[...numbers, { value: 'add-new', label: 'Add New' }]}
      value={form.values.Account_Title_Number || ""}
      onChange={(value) => {
        if (value === 'add-new') {
          openModal('numbers');
        } else {
          form.setFieldValue('Account_Title_Number', value || "");
        }
      }}
    />

    <Select
      label="Technician Name"
      searchable
      placeholder="Enter Technician Name (e.g., ABC)"
      data={technicians}
      {...form.getInputProps("Technician_Person_name")}
    />

    <NumberInput
      label="Installation Expense"
      placeholder="Enter Installation Expense (e.g., 900)"
      {...form.getInputProps("Technicianperson_Price")}
    />

    <NumberInput
      label="Travelling Expense"
      placeholder="Enter Travelling Expense (e.g., 300)"
      {...form.getInputProps("Travelling_Expense_Technician")}
    />
   <Select
     label="Technician Cost"
		  data={[{ value: "Company", label: "Company" },
			{ value: "Saleperson", label: "Saleperson" }]}
			{...form.getInputProps("Techniciancost")}
			/>
    <Select label="Technician Fuel"
		data={[{ value: "Company", label: "Company" },
		{ value: "Saleperson", label: "Saleperson" }]}
		{...form.getInputProps("Technicianfuel")}
		 />

    <Textarea
      label="Remarks"
      placeholder="Enter Remarks (e.g., XYZ)"
      {...form.getInputProps("Technician_Person_Remarks")}
    />

  </Stack>
)}


{selectedCategory === "OwnerShipChange" && (
    <Stack gap="sm">

<TextInput
    label="Vehicle"
    required
    value={vehicleInput} // Local state manages the input
    onChange={(event) => handleVehicleownershipchangeInputChange(event.target.value)}
    placeholder="Enter vehicle number (e.g., OP-1100, ABC-7800)"
  />

      <TextInput label="Party Name" required {...form.getInputProps("PartyName")}
			  placeholder="Enter Party Name (e.g., ABC)"
				/>

      <NumberInput label="Amount Received" {...form.getInputProps("Amount_Received")}
			 placeholder="Enter Amount Received (e.g., 15000)"
			 />

<Select
            label="Title Transaction"
            searchable
						placeholder="Enter Title Transaction (e.g., Mux Tech)"
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
      <Textarea label="Remarks" {...form.getInputProps("Technician_Person_Remarks")}
			 placeholder="Enter Remarks (e.g., ABC)" />
    </Stack>
  )}

{selectedCategory === "AMC" && (
    <Stack gap="sm">
      <Select
        label="Sale Person Name"
        required
				placeholder="Enter Sale Person Name (e.g., ABC)"
        searchable
			/*	disabled={readOnly} // Disable field if readOnly is true*/
        data={salespersons}
        {...form.getInputProps("Sale_Person_name")}
      />

<TextInput
    label="Vehicle"
    required
    value={vehicleInput} // Local state manages the input
    onChange={(event) => handleVehicleamcInputChange(event.target.value)}
    placeholder="Enter vehicle number (e.g., OP-1100, ABC-7800)"
  />

      <TextInput label="Party Name" required {...form.getInputProps("PartyName")}
			   /*   disabled={readOnly} // Disable field if readOnly is true */
			placeholder="Enter Party Name (e.g., ABC)"  />
      <Select
        label="Device"
        searchable
				placeholder="Enter Device (e.g., R16,R31)"
			/*	disabled={readOnly} // Disable field if readOnly is true */
        data={[...devices, { value: "add-new", label: "Add New" }]}
        {...form.getInputProps("Device")}
      />
<Select
            label="Package"
            searchable
						placeholder="Enter Package (e.g., Deluxe)"
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
      <NumberInput label="Subscription Amount" {...form.getInputProps("Subscription_Amount")}
			     /* disabled={readOnly} // Disable field if readOnly is true */
			 placeholder="Enter Subscription Amount (e.g., 18000)" />
      <NumberInput label="Amount Received" {...form.getInputProps("Amount_Received")}

			placeholder="Enter Amount Received (e.g., Amount Received)" />
      <Select
        label="City"
        searchable
				placeholder="Enter City (e.g., ABC)"
		/*		disabled={readOnly} // Disable field if readOnly is true */
        data={[...cities, { value: "add-new", label: "Add New" }]}
        {...form.getInputProps("City")}
      />
          <Select
            label="Title Transaction"
            searchable
						placeholder="Enter Title Transaction (e.g., Mux Tech)"
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


      <Textarea label="Remarks" {...form.getInputProps("Technician_Person_Remarks")}
							placeholder="Enter Remarks (e.g., Remarks)" />
    </Stack>
  )}

{selectedCategory === "Redo" && (
  <Stack gap="sm">

<TextInput
    label="Vehicle"
    required

    value={vehicleInput} // Local state manages the input
    onChange={(event) => handleVehicleredoInputChange(event.target.value)}
    placeholder="Enter vehicle number (e.g., OP-1100, ABC-7800)"
  />

    <TextInput label="Party Name" required {...form.getInputProps("PartyName")}
		     /* disabled={readOnly} // Disable field if readOnly is true */
					placeholder="Enter Party Name (e.g., ABC)" />
    <Select
      label="Device"
      searchable
			placeholder="Enter Device (e.g., R16,R31)"
      data={[...devices, { value: "add-new", label: "Add New" }]}
      {...form.getInputProps("Device")}
    />

<Select
            label="Package"
            searchable
						placeholder="Enter Package (e.g., Deluxe)"
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
						placeholder="Enter City (e.g., ABC)"
      data={[...cities, { value: "add-new", label: "Add New" }]}
      {...form.getInputProps("City")}
    />
    <NumberInput label="Subscription Amount" {...form.getInputProps("Subscription_Amount")}
     /* disabled={readOnly} // Disable field if readOnly is true*/
placeholder="Enter Subscription Amount (e.g., 17000)" />
    <NumberInput label="Amount Received" {...form.getInputProps("Amount_Received")}
		placeholder="Enter Amount Received (e.g., 17000)"  />
    <Select
            label="Title Transaction"
            searchable
						placeholder="Enter Title Transaction (e.g., Mux Tech)"
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
      label="Technician Name"
      searchable
			      placeholder="Enter Technician Name (e.g., ABC)"
      data={technicians}
      {...form.getInputProps("Technician_Person_name")}
    />
    <NumberInput label="Redo Expense" {...form.getInputProps("Technicianperson_Price")}
					      placeholder="Enter Redo Expense (e.g., 500)" />
    <NumberInput
      label="Travelling Expense"
			placeholder="Enter Travelling Expense (e.g., 500)"
      {...form.getInputProps("Travelling_Expense_Technician")}
    />
		   <Select
     label="Technician Cost"
		  data={[{ value: "Company", label: "Company" },
			{ value: "Saleperson", label: "Saleperson" }]}
			{...form.getInputProps("Techniciancost")}
			/>
    <Select label="Technician Fuel"
		data={[{ value: "Company", label: "Company" },
		{ value: "Saleperson", label: "Saleperson" }]}
		{...form.getInputProps("Technicianfuel")}
		 />
    <Textarea label="Remarks" {...form.getInputProps("Technician_Person_Remarks")}
					placeholder="Enter Remarks (e.g., XYZ)" />
  </Stack>
)}

			 {/* Render fields conditionally based on the selected category */}
			 {selectedCategory === "Recovery" && (
  <Stack gap="sm">
    <Select
      label="Sale Person Name"
      required
      placeholder="Enter Sale Person Name (e.g., ABC)"
      searchable
      data={salespersons}
    /*  disabled={readOnly} // Disable field if readOnly is true */
      {...form.getInputProps("Sale_Person_name")}
    />
    <TextInput
      label="Vehicle"
      required
      value={vehicleInput}
           onChange={(event) => handleVehiclerecoveryInputChange(event.target.value)}
      placeholder="Enter vehicle number (e.g., OP-1100, ABC-7800)"
    />
    <TextInput
      label="Party Name"
      required
    /*  disabled={readOnly} // Disable field if readOnly is true */
      {...form.getInputProps("PartyName")}
      placeholder="Enter Party Name (e.g., ABC)"
    />
    <Select
      label="Device"
      searchable
      placeholder="Enter Device (e.g., R16,R31)"
      data={[...devices, { value: "add-new", label: "Add New" }]}
   /*   disabled={readOnly} // Disable field if readOnly is true */
      {...form.getInputProps("Device")}
    />
   <Select
            label="Package"
            searchable
						placeholder="Enter Package (e.g., Deluxe)"
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
      placeholder="Enter City (e.g., ABC)"
      data={[...cities, { value: "add-new", label: "Add New" }]}
   /*   disabled={readOnly} // Disable field if readOnly is true */
      {...form.getInputProps("City")}
    />
    <NumberInput
      label="Subscription Amount"
     /* disabled={readOnly} // Disable field if readOnly is true */
      {...form.getInputProps("Subscription_Amount")}
      placeholder="Enter Subscription Amount (e.g., 18000)"
    />
    <NumberInput
      label="Amount Received"
     /* disabled={readOnly} // Disable field if readOnly is true */
      {...form.getInputProps("Amount_Received")}
      placeholder="Enter Amount Received (e.g., 18000)"
    />
<NumberInput
  label="Saleperson Fixed Price"
  {...form.getInputProps("Saleperson_FixedPrice")}
  placeholder="Enter Saleperson Fixed Price (e.g., 9000)"
/>

    <NumberInput
      label="Pending Payment"
    /*  disabled={readOnly} // Disable field if readOnly is true */
      {...form.getInputProps("Pending_Payment")}
      placeholder="Enter Pending Payment (e.g., 3000)"
    />
    <NumberInput
      label="Pending Recovery"

      {...form.getInputProps("Pending_Recovery")}
      placeholder="Enter Pending Recovery (e.g., 3000)"
    />
<Select
            label="Title Transaction"
            searchable
						placeholder="Enter Title Transaction (e.g., Mux Tech)"
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
      placeholder="Enter Remarks (e.g., ABC)"

      {...form.getInputProps("Technician_Person_Remarks")}
    />
  </Stack>
)}


					 {/* Render fields conditionally based on the selected category */}
					 {selectedCategory === "Removal" && (
        <Stack gap="sm">

<TextInput
    label="Vehicle"
    required
    value={vehicleInput} // Local state manages the input
    onChange={(event) => handleVehicleremovalInputChange(event.target.value)}
    placeholder="Enter vehicle number (e.g., OP-1100, ABC-7800)"
  />
        <TextInput label="Party Name" required {...form.getInputProps("PartyName")}
				placeholder="Enter Party Name (e.g., ABC)" />
				<Select
            label="Device"
            searchable
						placeholder="Enter Device (e.g., R16,R31)"
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
						placeholder="Enter Package (e.g., Deluxe)"
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
						placeholder="Enter City (e.g., ABC)"
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

        <NumberInput label="Amount Received" {...form.getInputProps("Amount_Received")}
				placeholder="Enter Amount Received (e.g., 18000)" />

          <Select
            label="Title Transaction"
            searchable
						placeholder="Enter Title Transaction(e.g., MUx Tech)"
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
          label="Technician Name"
          searchable
					placeholder="Enter Technician Person Name(e.g., ABC)"
          data={technicians}
          {...form.getInputProps("Technician_Person_name")}
        />
        <NumberInput
          label="Removal Expanse"
          {...form.getInputProps("Technicianperson_Price")}
					placeholder="Enter Removal Expanse(e.g., 500)"
        />
        <NumberInput
          label="Travelling Expense"
					placeholder="Enter Travelling Expense(e.g., 500)"
          {...form.getInputProps("Travelling_Expense_Technician")}
        />
				<Select
     label="Technician Cost"
		  data={[{ value: "Company", label: "Company" },
			{ value: "Saleperson", label: "Saleperson" }]}
			{...form.getInputProps("Techniciancost")}
			/>
    <Select label="Technician Fuel"
		data={[{ value: "Company", label: "Company" },
		{ value: "Saleperson", label: "Saleperson" }]}
		{...form.getInputProps("Technicianfuel")}
		 />

        <Textarea
          label="Remarks"
					placeholder="Enter Remarks(e.g., ABC)"
          {...form.getInputProps("Technician_Person_Remarks")}
        />
        </Stack>
      )}

					 {/* Render fields conditionally based on the selected category */}
					 {selectedCategory === "Removal Transfer" && (
        <Stack gap="sm">
 <TextInput
    label="Vehicle"
    required
    value={vehicleInput} // Local state manages the input
    onChange={(event) => handleVehicleretransfarInputChange(event.target.value)}
    placeholder="Enter vehicle number (e.g., OP-1100, ABC-7800)"
 />
        <TextInput label="Party Name" required {...form.getInputProps("PartyName")}
				placeholder="Enter Party Name(e.g., ABC)" />
				<Select
            label="Device"
            searchable
				/*		disabled={readOnly} // Disable field if readOnly is true */
						placeholder="Enter Device(e.g., R16,R31)"
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
						placeholder="Enter Package (e.g., Deluxe)"
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
						placeholder="Enter City(e.g., ABC)"
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

        <NumberInput label="Amount Received" {...form.getInputProps("Amount_Received")}
				placeholder="Enter Amount Received(e.g., 18000)" />

          <Select
            label="Title Transaction"
            searchable
						placeholder="Enter Title Transaction(e.g., Mux Tech)"
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
          label="Technician Name"
          searchable
					placeholder="Enter Technician Person Name(e.g., ABC)"
          data={technicians}
          {...form.getInputProps("Technician_Person_name")}
        />
        <NumberInput
          label="Removal Transfer Expanse"
          {...form.getInputProps("Technicianperson_Price")}
					placeholder="Enter Removal Transfer Expanse(e.g., 500)"
        />
        <NumberInput
          label="Travelling Expense"
          {...form.getInputProps("Travelling_Expense_Technician")}
					placeholder="Enter Travelling Expense(e.g., 500)"
        />

<Select
     label="Technician Cost"
		  data={[{ value: "Company", label: "Company" },
			{ value: "Saleperson", label: "Saleperson" }]}
			{...form.getInputProps("Techniciancost")}
			/>
    <Select label="Technician Fuel"
		data={[{ value: "Company", label: "Company" },
		{ value: "Saleperson", label: "Saleperson" }]}
		{...form.getInputProps("Technicianfuel")}
		 />

        <Textarea
          label="Remarks"
					placeholder="Enter Remarks(e.g., XYZ)"
          {...form.getInputProps("Technician_Person_Remarks")}
        />
        </Stack>
      )}

					 {/* Render fields conditionally based on the selected category */}
					 {selectedCategory === "Transfer" && (
        <Stack gap="sm">
<TextInput
    label="Vehicle"
    required
    value={vehicleInput} // Local state manages the input
    onChange={(event) => handleVehicletransferInputChange(event.target.value)}
    placeholder="Enter vehicle number (e.g., OP-1100, ABC-7800)"
  />
        <TextInput label="Party Name" required {...form.getInputProps("PartyName")}
				placeholder="Enter Party Name(e.g., ABC)" />
				<Select
            label="Device"
            searchable
						placeholder="Enter Device(e.g., R16,R31)"
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
						placeholder="Enter Package (e.g., Deluxe)"
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

        <NumberInput label="Amount Received" {...form.getInputProps("Amount_Received")}
				placeholder="Enter Amount Received(e.g., 18000)" />

				<Select
            label="City"
            searchable
						placeholder="Enter City(e.g., ABC)"
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
						placeholder="Enter Title Transaction(e.g., Mux Tech)"
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
          label="Technician Name"
          searchable
					placeholder="Enter Technician Person Name(e.g., Mux Tech)"
          data={technicians}
          {...form.getInputProps("Technician_Person_name")}
        />
        <NumberInput
          label="Transfer Expanse"
					placeholder="Enter Transfer Expanse(e.g., 700)"
          {...form.getInputProps("Technicianperson_Price")}
        />
        <NumberInput
          label="Travelling Expense"
          {...form.getInputProps("Travelling_Expense_Technician")}
        placeholder="Enter Travelling Expense(e.g., 700)"
				/>
<Select
     label="Technician Cost"
		  data={[{ value: "Company", label: "Company" },
			{ value: "Saleperson", label: "Saleperson" }]}
			{...form.getInputProps("Techniciancost")}
			/>
    <Select label="Technician Fuel"
		data={[{ value: "Company", label: "Company" },
		{ value: "Saleperson", label: "Saleperson" }]}
		{...form.getInputProps("Technicianfuel")}
		 />
        <Textarea
          label="Remarks"
          {...form.getInputProps("Technician_Person_Remarks")}
        placeholder="Enter Remarks(e.g., ABC)"
				/>
        </Stack>
      )}

        <Space h="md" />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Income"}
        </Button>
      </form>
    </Drawer>

      {/* Modals for adding new devices, cities, packages, and accounts */}
      <Modal opened={openDeviceModal} onClose={() => setOpenDeviceModal(false)}>
        <TextInput label="New Device" value={newDevice} onChange={(e) => setNewDevice(e.target.value)} />
        <Button onClick={() => handleNewEntry(newDevice, 'Device')}>Add Device</Button>
      </Modal>

      <Modal opened={openCityModal} onClose={() => setOpenCityModal(false)}>
        <TextInput label="New City" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
        <Button onClick={() => handleNewEntry(newCity, 'City')}>Add City</Button>
      </Modal>

      <Modal opened={openPackageModal} onClose={() => setOpenPackageModal(false)}>
        <TextInput label="New Package" value={newPackage} onChange={(e) => setNewPackage(e.target.value)} />
        <Button onClick={() => handleNewEntry(newPackage, 'package')}>Add Package</Button>
      </Modal>

      <Modal opened={openAccountModal} onClose={() => setOpenAccountModal(false)}>
        <TextInput label="New Title" value={newAccount} onChange={(e) => setNewAccount(e.target.value)} />
        <Button onClick={() => handleNewEntry(newAccount, 'account')}>Add Title</Button>
      </Modal>

			<Modal opened={openNumberModal} onClose={() => setOpenNumberModal(false)}>
        <TextInput label="New Number" value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        <Button onClick={() => handleNewEntry(newNumber, 'numbers')}>Add Number</Button>
      </Modal>

    </>
  );
};


