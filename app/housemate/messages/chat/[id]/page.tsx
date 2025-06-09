import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MobileChatView } from "@/app/components/chat/MobileChatView";

interface HousemateMobileChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function HousemateMobileChatPage({ params }: HousemateMobileChatPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/api/auth/login");
  }

  if (user.userType !== "HOUSEMATE") {
    redirect("/api/auth/login");
  }

  const { id } = await params;

  return (
    <MobileChatView
      chatRoomId={id}
      userType="HOUSEMATE"
      currentUserId={user.id}
      user={user}
      backPath="/housemate/messages"
    />
  );
} 