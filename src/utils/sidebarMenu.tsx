import type { SidebarMenuItem } from "../types/menu.types";

import {
  FiHome,
  FiFolder,
  FiUsers,
  FiUserCheck,
} from "react-icons/fi";

import { ROLES } from "../constants/roles";

export const sidebarMenu: SidebarMenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <FiHome />,
    roles: [
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.DEVELOPER,
    ],
  },

  {
    label: "Projects",
    path: "/projects",
    icon: <FiFolder />,
    roles: [
      ROLES.ADMIN,
    ],
  },

  {
    label: "My Projects",
    path: "/my-projects",
    icon: <FiFolder />,
    roles: [
      ROLES.MANAGER,
    ],
  },

  {
    label: "Managers",
    path: "/managers",
    icon: <FiUserCheck />,
    roles: [ROLES.ADMIN],
  },

  {
    label: "Teams",
    path: "/teams",
    icon: <FiUsers />,
    roles: [
      ROLES.ADMIN,
      ROLES.MANAGER,
    ],
  },
];