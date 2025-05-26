import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface MessagesIconProps {
  userType?: "HOMEOWNER" | "HOUSEMATE" | "ADMIN" | null;
}

export function MessagesIcon({ userType }: MessagesIconProps) {
  const getMessagesLink = () => {
    switch (userType) {
      case "HOMEOWNER":
        return "/homeowner/messages";
      case "HOUSEMATE":
        return "/housemate/messages";
      default:
        return "/onboarding";
    }
  };

  // Don't render if user doesn't have a valid user type
  if (!userType || userType === "ADMIN") {
    return null;
  }

  return (
    <Button variant="ghost" size="sm" asChild className="relative hover:bg-muted flex flex-col items-center gap-1 h-auto py-2">
      <Link href={getMessagesLink()}>
        <MessageCircle className="h-12 w-12" />
        <span className="text-xs font-medium">Messages</span>
      </Link>
    </Button>
  );
} 