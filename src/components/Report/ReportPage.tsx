"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Select, Button, Group } from "@mantine/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { showNotification } from "@mantine/notifications";
import moment from "moment";
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary

const ReportPage = () => {
  const [reportType, setReportType] = useState<string | null>(null);
  const [incomeCategories, setIncomeCategories] = useState<{ value: string; label: string }[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<{ value: string; label: string }[]>([]);
  const [salespersons, setSalespersons] = useState<{ value: string; label: string }[]>([]);
  const [salespersonPending, setSalespersonPending] = useState<{ value: string; label: string }[]>([]);
  const [incomecategoriesSaleperson, setIncomeCategoriesSaleperson] = useState<{ value: string; label: string }[]>([]);
  const [technicians, setTechnicians] = useState<{ value: string; label: string }[]>([]);
  const [reportPeriod, setReportPeriod] = useState<string>("Today");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState<string | null>(null);
  const [selectSalespersonCategory, setSelectSalespersonCategory] = useState<string | null>(null);
  const [selectedSalespersonPending, setSelectedSalespersonPending] = useState<string | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);

  // Helper function to format the date
  const formatDate = (date: Date | null) => {
    if (date) {
      return moment(date).format("YYYY-MM-DD");
    }
    return "";
  };

  // Fetch data for categories, salespersons, and technicians
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          salespersonResponse,
          salespersonPendingResponse,
          incomeCategorySalepersonResponse,
          technicianResponse,
          incomeCategoryResponse,
          expenseCategoryResponse,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/saleperson/get-sale`),
          axios.get(`${API_BASE_URL}/api/saleperson/get-sale`),
          axios.get(`${API_BASE_URL}/api/income/get-Category`),
          axios.get(`${API_BASE_URL}/api/technician/get-technician`),
          axios.get(`${API_BASE_URL}/api/income/get-Category`),
          axios.get(`${API_BASE_URL}/api/expanse/get-Category`),
        ]);

        setSalespersons(
          salespersonResponse.data.records.map((person: any) => ({
            value: person.Sale_Person_name,
            label: person.Sale_Person_name,
          }))
        );

        setIncomeCategoriesSaleperson(
          incomeCategorySalepersonResponse.data.records.map((category: any) => ({
            value: category.CategoryIncome,
            label: category.CategoryIncome,
          }))
        );

        setTechnicians(
          technicianResponse.data.records.map((tech: any) => ({
            value: tech.Technician_Person_name,
            label: tech.Technician_Person_name,
          }))
        );

        setIncomeCategories(
          incomeCategoryResponse.data.records.map((category: any) => ({
            value: category.CategoryIncome,
            label: category.CategoryIncome,
          }))
        );

				setSalespersonPending(
					salespersonPendingResponse.data.records.map((pending: any) => ({
						value: pending.Sale_Person_name,
						label: pending.Sale_Person_name,
					}))
				);

        setExpenseCategories(
          expenseCategoryResponse.data.records.map((category: any) => ({
            value: category.CategoryExpanse,
            label: category.CategoryExpanse,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDownloadReport = async () => {
    try {
      let url = `${API_BASE_URL}/api/exportReport`;
      const params: any = { reportPeriod };

      switch (reportType) {
        case "SalespersonPending":
          url = `${API_BASE_URL}/api/export/salepersonname-pending-Report/${selectedSalespersonPending}`;
          break;
        case "SalespersonReport":
          url = `${API_BASE_URL}/api/export/salesperson`;
          params.name = selectedSalesperson;
          params.category = selectSalespersonCategory;
          break;
        case "IncomeWithCategory":
          url = `${API_BASE_URL}/api/export/income-category-report/${selectedCategory}`;
          break;
        // Add other cases as required
				case "TechnicianReport":
					url = `${API_BASE_URL}/api/export/technician-name-report/${selectedTechnician}`;
					break;
				case "ExpanseWithCategory":
					url = `${API_BASE_URL}/api/export/expanse-category/${selectedCategory}`;
					break;
				case "AllIncomeReport":
					url = `${API_BASE_URL}/api/export/all-income-report`;
					break;
				case "AllIncomeRecordReport":
					url = `${API_BASE_URL}/api/export/all-income-record-report`;
					break;
				case "AllPendingReport":
					url = `${API_BASE_URL}/api/export/All-pending-Report`;
					break;
				case "AllpendingRecordReport":
					url = `${API_BASE_URL}/api/export/pending-record-Report`;
					break;
				case "AllTechnicianReport":
					url = `${API_BASE_URL}/api/export/all-technician-report`;
					break;
				case "AllExpanseReport":
					url = `${API_BASE_URL}/api/export/all-expanse-report`;
					break;
					case "AllSalespersonReport":
					url = `${API_BASE_URL}/api/export/all-salesperson-report`;
					break;
				case "AllExpanseRecordReport":
					url = `${API_BASE_URL}/api/export/all-expanse-record-report`;
					break;
        default:
          showNotification({ message: "Please select a valid report type.", color: "red" });
          return;
      }

      if (reportPeriod === "Custom" && startDate && endDate) {
        params.customStart = formatDate(startDate);
        params.customEnd = formatDate(endDate);
      }

      const response = await axios.get(url, { params, responseType: "blob" });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `${reportType}-Report.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error);
      showNotification({ message: "Error generating the report.", color: "red" });
    }
  };

  return (
    <div >
      <h1>Generate Report</h1>
      <Group>
        <Select
          label="Report Type"
					searchable
          placeholder="Select a report type"
          data={[
            { value: "IncomeWithCategory", label: "Income With Category",  },
            { value: "SalespersonPending", label: "Salesperson Pending Wise" },
            { value: "SalespersonReport", label: "Salesperson Report" },
            { value: "TechnicianReport", label: "Technician Report" },
            { value: "ExpanseWithCategory", label: "Expanse With Category" },
            { value: "AllIncomeReport", label: "All Income Report" },

            { value: "AllPendingReport", label: "Pending Summary" },
            { value: "AllpendingRecordReport", label: "Pending Record Report" },
            { value: "AllSalespersonReport", label: "All Salesperson Report" },
            { value: "AllTechnicianReport", label: "All Technician Report" },
            { value: "AllExpanseReport", label: "All Expanse Report" },
            { value: "AllExpanseRecordReport", label: "All Expanse Record Report" },
          ]}
          value={reportType}
          onChange={setReportType}
        />

        <select onChange={(e) => setReportPeriod(e.target.value)} value={reportPeriod}>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="Custom">Custom</option>
        </select>

        {reportPeriod === "Custom" && (
          <>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date"
              dateFormat="yyyy-MM-dd"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End Date"
              dateFormat="yyyy-MM-dd"
            />
          </>
        )}
				 {reportType === "ExpanseWithCategory" && (
          <Select
            label="Category"
            placeholder="Select a category"
            data={expenseCategories}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
        )}

{reportType === "IncomeWithCategory" && (
          <Select
            label="Category"
            placeholder="Select a category"
            data={incomeCategories}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
        )}

				{reportType === "SalespersonReport" && (
          <>
            <Select
              label="Salesperson"
              placeholder="Select a salesperson"
              data={salespersons}
              value={selectedSalesperson}
              onChange={setSelectedSalesperson}
            />
            {selectedSalesperson && (
              <Select
                label="Salesperson Category"
                placeholder="Select a category"
                data={incomecategoriesSaleperson}
                value={selectSalespersonCategory}
                onChange={setSelectSalespersonCategory}
              />
            )}
          </>
        )}

	 {reportType === "TechnicianReport" && (
          <Select
            label="Technician"
            placeholder="Select a technician"
            data={technicians}
            value={selectedTechnician}
            onChange={setSelectedTechnician}
          />
        )}

        {reportType === "SalespersonPending" && (
          <Select
            label="Salesperson Pending"
            placeholder="Select a salesperson"
            data={salespersonPending}
            value={selectedSalespersonPending}
            onChange={setSelectedSalespersonPending}
          />
        )}
      </Group>
      <Button onClick={handleDownloadReport}>Download Report</Button>
    </div>
  );
};

export default ReportPage;
