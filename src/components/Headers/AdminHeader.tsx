"use client";

import { Box, Menu, Text, UnstyledButton } from "@mantine/core";
import { IconChevronDown, IconLogout, IconUser } from "@tabler/icons-react";
import API_BASE_URL from "@/utils/config"; // Adjust the path as necessary
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { jwtDecode } from "jwt-decode"; // Ensure correct import
import axios from "axios";
import classes from "./AdminHeader.module.css";
import logo from "../../../public/logo.jpg";

// Define the type for the decoded token
interface DecodedToken {
  userId: string;
}

interface User {
  username: string;
  role: string;
}

interface Props {
  burger?: React.ReactNode;
}

export function AdminHeader({ burger }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      const token = document.cookie.split('=')[1]; // Get token from cookie

      if (token) {
        try {
          // Decode the token to extract userId
          const decodedToken = jwtDecode<DecodedToken>(token);
          console.log("Decoded Token:", decodedToken);

          // Make API call to fetch user data using the token
          const response = await axios.get(`${API_BASE_URL}/api/auth/single-user/${decodedToken.userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Make sure cookies are sent along with requests
          });

          console.log("API Response:", response.data);

          // Set the user state with the API response
          if (response.data && response.data.username) {
            setUser(response.data);
          } else {
            console.warn("User data not found in API response");
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        console.warn("No token found in cookies");
        setUser(null);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  // Logout functionality
  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0"; // Remove token from cookies
    setUser(null);
    router.push("/login");
  };

  // Navigate to user profile page
  const navigateToProfile = () => {
    router.push("/user-profile");
  };

  if (loading) {
    // Show a loading state while user data is being fetched
    return (
      <header className={classes.header}>
        <Text>Loading...</Text>
      </header>
    );
  }

  return (
    <header className={classes.header}>
      {burger && burger}
      <Image src={logo} alt="Logo" width={1000} height={40} />

      <Box style={{ flex: 1 }} />

      {/* User Dropdown */}
      <Box style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1rem" }}>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <UnstyledButton style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {/* Show user username and role */}
              <Text>{user?.username || "Guest"}</Text> {/* Show username */}
              <Text color="dimmed" size="sm">
                ({user?.role}) {/* Show role */}
              </Text>
              <IconChevronDown size={16} />
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={navigateToProfile}>
              <IconUser size={16} style={{ marginRight: "8px" }} />
              User Profile
            </Menu.Item>
            <Menu.Item color="red" onClick={handleLogout}>
              <IconLogout size={16} style={{ marginRight: "8px" }} />
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </header>
  );
}
