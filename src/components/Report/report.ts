"use server"

import axios from 'axios';
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary


// Utility function to handle API call for generating the income report
export const generateIncomeReport = async (
  reportPeriod: string,
  customStartDate: Date | null,
  customEndDate: Date | null
) => {
  const params: any = { reportPeriod };
  if (reportPeriod === 'Custom' && customStartDate && customEndDate) {
    params.customStart = customStartDate.toISOString();
    params.customEnd = customEndDate.toISOString();
  }

  // Make the API request and download the PDF
  const response = await axios.get('${API_BASE_URL}/api/export/all-income-report', {
    params,
    responseType: 'blob', // We expect a binary response
  });

  // Create a URL for the blob and download it
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'All_Income_Report_Summary.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
};
