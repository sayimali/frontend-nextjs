import {
  IconComponents,
  IconDashboard,
  IconLock,
} from "@tabler/icons-react";
import type { NavItem } from "@/types/nav-item";

export const navLinks: NavItem[] = [
  { label: "Dashboard", icon: IconDashboard, link: "/dashboard" },

	{
    label: "Auth",
    icon: IconLock,
    initiallyOpened: true,
    links: [

      {
        label: "User",
        link: "/dashboard/register",
      },
    ],
  },


  {
    label: "Components",
    icon: IconComponents,
    initiallyOpened: true,
    links: [
      {
        label: "Income",
        link: "/dashboard/Income",
      },
      {
        label: "Expanse",
        link: "/dashboard/Expanse",
      },
			{
        label: "Sale Person",
        link: "/dashboard/Sale",
      },
      {
        label: "Technician Person",
        link: "/dashboard/Technician",
      },
      {
        label: "Monthly Report",
        link: "/dashboard/Report",
      },
			{
        label: "Category Expanse",
        link: "/dashboard/Categoryexpanse",
      },
			{
        label: "Category Income",
        link: "/dashboard/Categoryincome",
      },

    ],
  },
];
