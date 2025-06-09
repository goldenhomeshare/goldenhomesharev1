import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  MessageCircle, 
  ArrowLeft, 
  Search, 
  Eye, 
  EyeOff,
  Mail
} from "lucide-react";
import { HomeownerConversationList } from "@/app/components/chat";
import { ChatWindow } from "@/app/components/chat/ChatWindow";
import { Suspense } from "react";

async function getHomeownerChats(userId: string, showHidden: boolean = false) {
  const chatRooms = await prisma.chatRoom.findMany({
    where: {
      homeownerId: userId,
      hiddenByHomeowner: showHidden,
    } as any,
    include: {
      housemate: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          images: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
        },
      },
    },
    orderBy: {
      lastMessageAt: "desc",
    },
  });

  return chatRooms;
}

export default async function HomeownerMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ showHidden?: string; chatId?: string; housemate?: string; product?: string }>;
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }
  
  const userType = (user as any).userType;
  
  if (userType !== "HOMEOWNER") {
    redirect("/onboarding");
  }

  const resolvedSearchParams = await searchParams;
  const showHidden = resolvedSearchParams.showHidden === "true";
  let selectedChatId = resolvedSearchParams.chatId;
  const housemateId = resolvedSearchParams.housemate;
  const productId = resolvedSearchParams.product;

  // If housemate parameter is provided, find or create a unified conversation
  if (housemateId && !selectedChatId) {
    try {
      // Find existing conversation between these users
      const existingChatRoom = await prisma.chatRoom.findFirst({
        where: {
          homeownerId: user.id,
          housemateId: housemateId,
        },
      });

      if (existingChatRoom) {
        // Redirect to the existing conversation
        const url = new URL('/homeowner/messages', 'https://goldenhomeshare.com');
        url.searchParams.set('chatId', existingChatRoom.id);
        if (showHidden) url.searchParams.set('showHidden', 'true');
        redirect(url.pathname + url.search);
      } else if (productId) {
        // Create new conversation for this product context
        const newChatRoom = await prisma.chatRoom.create({
          data: {
            homeownerId: user.id,
            housemateId: housemateId,
            productId: productId,
          },
        });
        
        // Redirect to the new conversation
        const url = new URL('/homeowner/messages', 'https://goldenhomeshare.com');
        url.searchParams.set('chatId', newChatRoom.id);
        if (showHidden) url.searchParams.set('showHidden', 'true');
        redirect(url.pathname + url.search);
      }
    } catch (error) {
      console.error("Error finding/creating conversation:", error);
      // Continue with normal flow if there's an error
    }
  }

  const chatRooms = await getHomeownerChats(user.id, showHidden);
  
  // Filter out chat rooms without required data
  const validChatRooms = chatRooms.filter(room => 
    room.housemate && room.product && room.housemate.id && room.product.id
  );

  // Get counts for both visible and hidden conversations
  const visibleCount = await prisma.chatRoom.count({
    where: { homeownerId: user.id, hiddenByHomeowner: false } as any
  });
  const hiddenCount = await prisma.chatRoom.count({
    where: { homeownerId: user.id, hiddenByHomeowner: true } as any
  });

  // Find the selected chat room
  const selectedChatRoom = selectedChatId 
    ? validChatRooms.find(room => room.id === selectedChatId)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile View - Full Messaging Interface */}
      <div className="md:hidden bg-gray-50 min-h-[calc(100vh-6rem)]">
        <Suspense fallback={<div className="p-4">Loading messages...</div>}>
          <HomeownerConversationList 
            chatRooms={validChatRooms}
            currentUserId={user.id}
            user={user}
            isHidden={showHidden}
            selectedChatId={selectedChatId}
          />
        </Suspense>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex h-[calc(100vh-6rem)] bg-gray-50">
        {/* Left Panel - Conversations List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="lg:hidden">
                <Link href="/homeowner/dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="hidden lg:block">
                <Link href="/homeowner/dashboard" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            </div>
          </div>

          {/* Toggle Buttons - Improved Layout */}
          <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
            <Link 
              href="/homeowner/messages"
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                !showHidden 
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Active</span>
              <Badge variant={!showHidden ? "default" : "secondary"} className="ml-1 text-xs px-2 py-0.5">
                {visibleCount}
              </Badge>
            </Link>
            <Link 
              href="/homeowner/messages?showHidden=true"
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                showHidden 
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <EyeOff className="w-4 h-4" />
              <span>Hidden</span>
              <Badge variant={showHidden ? "default" : "secondary"} className="ml-1 text-xs px-2 py-0.5">
                {hiddenCount}
              </Badge>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-white border-gray-300 text-sm h-10 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {validChatRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                {showHidden ? (
                  <EyeOff className="w-6 h-6 text-gray-400" />
                ) : (
                  <MessageCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {showHidden ? "No hidden conversations" : "No conversations yet"}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {showHidden 
                  ? "Hidden conversations will appear here and can be restored at any time."
                  : "When potential housemates reach out about your properties, their messages will appear here."
                }
              </p>
              {!showHidden && (
                <Button asChild className="mt-4" size="sm">
                  <Link href="/homeowner/dashboard">Manage Properties</Link>
                </Button>
              )}
            </div>
          ) : (
            <HomeownerConversationList 
              chatRooms={validChatRooms} 
              currentUserId={user.id}
              user={user}
              isHidden={showHidden}
              selectedChatId={selectedChatId}
            />
          )}
        </div>
      </div>

        {/* Right Panel - Chat Window */}
        <div className="flex-1 flex flex-col bg-white">
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }>
            <ChatWindow
              selectedChatRoom={selectedChatRoom}
              userType="HOMEOWNER"
              currentUserId={user.id}
              user={user}
            />
          </Suspense>
        </div>
    </div>
    </div>
  );
} 