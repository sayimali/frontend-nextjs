"use client";

import { useEffect, useState } from "react";
import { Flex, Grid, GridCol, Card, Text, Loader, Select } from "@mantine/core";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import API_BASE_URL from "@/utils/config";

export function DashboardContent() {
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [expenses, setExpenses] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState("today");
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        let incomeUrl = `${API_BASE_URL}/api/income/get-income-filter`;
        let expenseUrl = `${API_BASE_URL}/api/expanse/get-Expanse-filter`;

        if (filter === "today") {
          incomeUrl += "?period=Today";
          expenseUrl += "?period=Today";
        } else if (filter === "yesterday") {
          incomeUrl += "?period=Yesterday";
          expenseUrl += "?period=Yesterday";
        } else if (filter === "Custom" && startDate && endDate) {
          const formattedStart = startDate
            ? new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000)
                .toISOString()
                .split("T")[0]
            : null;

          const formattedEnd = endDate
            ? new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000)
                .toISOString()
                .split("T")[0]
            : null;

          incomeUrl += `?period=Custom&customStart=${formattedStart}&customEnd=${formattedEnd}`;
          expenseUrl += `?period=Custom&customStart=${formattedStart}&customEnd=${formattedEnd}`;
        }

        const [incomeResponse, expenseResponse] = await Promise.all([
          axios.get(incomeUrl),
          axios.get(expenseUrl),
        ]);

        setTotals({
          Total_Vehicle: incomeResponse.data.Total_Vehicle || 0,
          Total_Sale_Person: incomeResponse.data.Total_Sale_Person || 0,
          Total_Amount_Received: incomeResponse.data.Total_Amount_Received || 0,
          Total_Saleperson_FixedPrice: incomeResponse.data.Total_Saleperson_FixedPrice || 0,
          Total_Excess_Amount: incomeResponse.data.Total_Excess_Amount || 0,
          Total_Pending_Payment: incomeResponse.data.Total_Pending_Payment || 0,
          Total_Pending_Recovery: incomeResponse.data.Total_Pending_Recovery || 0,
          Total_Technician_Person: incomeResponse.data.Total_Technician_Person || 0,
          Total_TechnicianCost: incomeResponse.data.Total_TechnicianCost || 0,
          Total_TechnicianFuel: incomeResponse.data.Total_TechnicianFuel || 0,
          Total_Technician_Expanse: incomeResponse.data.Total_Technician_Expanse || 0,
          Total_Amount: incomeResponse.data.Total_Amount || 0,
        });

        setExpenses({
          Total_Expanse_name: expenseResponse.data.Total_Expanse_name || 0,
          Total_Expanse_Amount: expenseResponse.data.Total_Expanse_Amount || 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (filter !== "Custom" || (startDate && endDate)) {
      fetchData();
    }
  }, [filter, startDate, endDate]);

  const cardColors = [
    "rgba(255, 99, 132, 0.3)",
    "rgba(54, 162, 235, 0.3)",
    "rgba(255, 206, 86, 0.3)",
    "rgba(75, 192, 192, 0.3)",
    "rgba(153, 102, 255, 0.3)",
    "rgba(255, 159, 64, 0.3)",
    "rgba(199, 199, 199, 0.3)",
    "rgba(83, 102, 255, 0.3)",
    "rgba(255, 56, 96, 0.3)",
    "rgba(38, 120, 255, 0.3)",
  ];

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ height: "100vh" }}>
        <Loader size="lg" />
      </Flex>
    );
  }

  return (
    <div>
      <Flex justify="center" mb="md">
        <Select
          value={filter}
          onChange={(value) => setFilter(value!)}
          data={[
            { value: "today", label: "Today" },
            { value: "yesterday", label: "Yesterday" },
            { value: "Custom", label: "Custom" },
          ]}
          placeholder="Select Filter"
        />
      </Flex>

      {filter === "Custom" && (
        <Flex justify="center" gap="md">
          <DatePicker
            value={startDate ? dayjs(startDate) : null}
            onChange={(date) => setStartDate(date?.toDate() || null)}
            format="YYYY-MM-DD"
            placeholder="Start Date"
          />
          <DatePicker
            value={endDate ? dayjs(endDate) : null}
            onChange={(date) => setEndDate(date?.toDate() || null)}
            format="YYYY-MM-DD"
            placeholder="End Date"
          />
        </Flex>
      )}

      <Grid gutter="lg">
        {[
          { label: "Total Vehicles", key: "Total_Vehicle" },
          { label: "Total Sale Persons", key: "Total_Sale_Person" },
          { label: "Total Amount Received", key: "Total_Amount_Received" },
          { label: "Total Saleperson Fixed Price", key: "Total_Saleperson_FixedPrice" },
          { label: "Total Excess Amount", key: "Total_Excess_Amount" },
          { label: "Total Pending Payment", key: "Total_Pending_Payment" },
          { label: "Total Pending Recovery", key: "Total_Pending_Recovery" },
          { label: "Total Technician Persons", key: "Total_Technician_Person" },
          { label: "Total Technician Cost", key: "Total_TechnicianCost" },
          { label: "Total Technician Fuel", key: "Total_TechnicianFuel" },
          { label: "Total Technician Expanse", key: "Total_Technician_Expanse" },
          { label: "Total Amount", key: "Total_Amount" },
          { label: "Total Expense", key: "Total_Expanse_name" },
          { label: "Total Expense Amount", key: "Total_Expanse_Amount" },
        ].map((field, index) => (
          <GridCol key={field.key} span={{ sm: 12, md: 4, lg: 3 }}>
            <Card
              p="md"
              radius="md"
              style={{
                backgroundColor: cardColors[index % cardColors.length],
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Text size="lg" fw={600}>
                {field.label}
              </Text>
              <Text size="xl" fw={700}>
                {field.key.startsWith("Total_Expanse") ? expenses[field.key] ?? 0 : totals[field.key] ?? 0}
              </Text>
            </Card>
          </GridCol>
        ))}
      </Grid>
    </div>
  );
}
