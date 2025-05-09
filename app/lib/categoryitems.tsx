import { DoorClosedLocked, HousePlusIcon, PartyPopper, Users } from "lucide-react";
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
    title: "Housemate",
    image: <Users />,
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
    image: <HousePlusIcon />,
  },
];