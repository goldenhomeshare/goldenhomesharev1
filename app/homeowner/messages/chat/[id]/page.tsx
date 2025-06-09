import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MobileChatView } from "@/app/components/chat/MobileChatView";

interface HomeownerMobileChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function HomeownerMobileChatPage({ params }: HomeownerMobileChatPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/api/auth/login");
  }

  if (user.userType !== "HOMEOWNER") {
    redirect("/api/auth/login");
  }

  const { id } = await params;

  return (
    <MobileChatView
      chatRoomId={id}
      userType="HOMEOWNER"
      currentUserId={user.id}
      user={user}
      backPath="/homeowner/messages"
    />
  );
} 