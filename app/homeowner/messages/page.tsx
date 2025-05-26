import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, User, ArrowLeft, Inbox, Users, Eye, EyeOff } from "lucide-react";
import { HomeownerChatCard } from "@/app/components/chat/HomeownerChatCard";

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
              firstName: true,
              lastName: true,
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
  searchParams: Promise<{ showHidden?: string }>;
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
  const chatRooms = await getHomeownerChats(user.id, showHidden);
  const unreadCount = 0; // TODO: Implement unread message count

  // Get counts for both visible and hidden conversations
  const visibleCount = await prisma.chatRoom.count({
    where: { homeownerId: user.id, hiddenByHomeowner: false } as any
  });
  const hiddenCount = await prisma.chatRoom.count({
    where: { homeownerId: user.id, hiddenByHomeowner: true } as any
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/homeowner/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              {!showHidden && visibleCount > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {visibleCount} conversation{visibleCount !== 1 ? 's' : ''}
                </Badge>
              )}
              {showHidden && hiddenCount > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  {hiddenCount} hidden
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Inbox className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {showHidden ? "Hidden Messages" : "Messages"}
              </h1>
              <p className="text-gray-600 mt-1">
                {showHidden 
                  ? "Manage your hidden conversations" 
                  : "Connect with potential housemates and manage your property inquiries"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Toggle between visible and hidden conversations */}
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant={!showHidden ? "default" : "outline"} 
            size="sm" 
            asChild
          >
            <Link href="/homeowner/messages">
              <Eye className="w-4 h-4 mr-2" />
              Active ({visibleCount})
            </Link>
          </Button>
          <Button 
            variant={showHidden ? "default" : "outline"} 
            size="sm" 
            asChild
          >
            <Link href="/homeowner/messages?showHidden=true">
              <EyeOff className="w-4 h-4 mr-2" />
              Hidden ({hiddenCount})
            </Link>
          </Button>
        </div>

        {/* Messages Content */}
        {chatRooms.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  {showHidden ? (
                    <EyeOff className="w-10 h-10 text-gray-400" />
                  ) : (
                    <MessageCircle className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {showHidden ? "No hidden conversations" : "No messages yet"}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {showHidden 
                    ? "You haven't hidden any conversations yet. Hidden conversations will appear here and can be restored at any time."
                    : "When potential housemates reach out about your properties, their messages will appear here. You'll be able to chat, review their profiles, and manage applications all in one place."
                  }
                </p>
                {!showHidden && (
                  <div className="space-y-3 text-sm text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Receive inquiries about your listings</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Chat directly with interested housemates</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Review profiles and manage applications</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {showHidden ? "Hidden Conversations" : "Recent Conversations"}
              </h2>
              <p className="text-sm text-gray-500">
                Sorted by most recent activity
              </p>
            </div>
            {chatRooms.map((chatRoom: any) => (
              <HomeownerChatCard 
                key={chatRoom.id} 
                chatRoom={chatRoom} 
                user={user} 
                isHidden={showHidden}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 