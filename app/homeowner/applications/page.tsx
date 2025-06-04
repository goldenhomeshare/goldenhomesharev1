import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, CheckCircle, XCircle, User, MessageSquare, Calendar, CalendarDays, FileText } from "lucide-react";
import Link from "next/link";
import { ApplicationActionButtons } from "../../components/ApplicationActionButtons";
import { format } from "date-fns";

async function getApplicationsForHomeowner(userId: string) {
  const applications = await prisma.application.findMany({
    where: {
      product: {
        userId: userId,
      },
    },
    include: {
      housemate: {
        include: {
          housemateProfile: true,
        },
      },
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return applications;
}

export default async function HomeownerApplicationsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const applications = await getApplicationsForHomeowner(user.id);

  const pendingApplications = applications.filter(app => app.status === "PENDING");
  const reviewedApplications = applications.filter(app => app.status !== "PENDING");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "APPROVED":
        return <CheckCircle className="h-4 w-4" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const ApplicationCard = ({ application, showActions = false }: { application: any, showActions?: boolean }) => (
    <Card key={application.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={application.housemate.housemateProfile?.profilePicture} />
              <AvatarFallback>
                {application.housemate.firstName?.[0]}{application.housemate.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-lg">
                {application.housemate.firstName} {application.housemate.lastName}
              </CardTitle>
              <CardDescription>
                Applied for: {application.product.name}
              </CardDescription>
              <p className="text-sm text-muted-foreground">
                {application.housemate.housemateProfile?.occupation && 
                  `${application.housemate.housemateProfile.occupation} • `
                }
                Budget: ${application.housemate.housemateProfile?.maxBudget || 'Not specified'}/month
              </p>
            </div>
          </div>
          <Badge
            className={`${getStatusColor(application.status)} flex items-center gap-1`}
          >
            {getStatusIcon(application.status)}
            {application.status === "APPROVED" 
              ? "APPROVED - CREATE AGREEMENT"
              : application.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stay Duration Section */}
          {application.moveInDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                Intended Stay Period
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <span className="font-medium">Move-in Date:</span>
                    <br />
                    <span className="text-blue-700">
                      {format(new Date(application.moveInDate), "MMMM dd, yyyy")}
                    </span>
                  </div>
                </div>
                {application.moveOutDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <span className="font-medium">Move-out Date:</span>
                      <br />
                      <span className="text-blue-700">
                        {format(new Date(application.moveOutDate), "MMMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                )}
                {!application.moveOutDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="font-medium">Move-out Date:</span>
                      <br />
                      <span className="text-gray-500">Not specified (long-term)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {application.housemate.housemateProfile?.bio && (
            <div>
              <h4 className="font-medium mb-2">About:</h4>
              <p className="text-sm text-muted-foreground">
                {application.housemate.housemateProfile.bio}
              </p>
            </div>
          )}
          
          {application.message && (
            <div>
              <h4 className="font-medium mb-2">Application Message:</h4>
              <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                {application.message}
              </p>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Applied on {new Date(application.createdAt).toLocaleDateString()}
            </span>
            <div className="flex gap-2">
              <Link href={`/housemate/profile/${application.housemate.id}`}>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </Link>
              <Link href={`/homeowner/messages?housemate=${application.housemate.id}&product=${application.product.id}`}>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </Link>
              {showActions && application.status === "PENDING" && (
                <ApplicationActionButtons applicationId={application.id} />
              )}
              {application.status === "APPROVED" && (
                <Link href={`/homeowner/agreement/${application.id}`}>
                  <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Agreement
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Property Applications</h1>
        <p className="text-muted-foreground">
          Review and manage applications from potential housemates
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pending ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="reviewed">
            Reviewed ({reviewedApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApplications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Pending Applications</h3>
                <p className="text-muted-foreground">
                  You don't have any pending applications at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {pendingApplications.map((application) => (
                <ApplicationCard 
                  key={application.id} 
                  application={application} 
                  showActions={true} 
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          {reviewedApplications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reviewed Applications</h3>
                <p className="text-muted-foreground">
                  You haven't reviewed any applications yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {reviewedApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 