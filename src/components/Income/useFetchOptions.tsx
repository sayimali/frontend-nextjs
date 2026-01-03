import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary

export const useFetchOptions = () => {
  const [salespersons, setSalespersons] = useState<string[]>([]);
  const [technicians, setTechnicians] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [salespersonsData, techniciansData, categoriesData] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/saleperson/get-sale`).then((res) => res.data.map((p: any) => p.name)),
          axios.get(`${API_BASE_URL}/api/technician/get-technician`).then((res) => res.data.map((t: any) => t.name)),
          axios.get(`${API_BASE_URL}/api/income/get-Category`).then((res) => res.data.map((c: any) => c.name)),
        ]);
        setSalespersons(salespersonsData);
        setTechnicians(techniciansData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  return { salespersons, technicians, categories, loading };
};
