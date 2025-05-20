import { DoorClosedLocked, HousePlusIcon, Warehouse, Users } from "lucide-react";
import { ReactNode } from "react";

interface iAppProps {
  name: string;
  title: string;
  image: ReactNode;
  id: number;
}

export const categoryItems: iAppProps[] = [
  {
    id: 0,
    name: "template",
    title: "Homeowner with Private Suite",
    image: <HousePlusIcon />,
  },
  {
    id: 1,
    name: "uikit",
    title: "Homeowner with Private Room",
    image: <DoorClosedLocked />,
  },
  {
    id: 2,
    name: "icon",
    title: "Homeowner with ADU",
    image: <Warehouse />,
  },
];