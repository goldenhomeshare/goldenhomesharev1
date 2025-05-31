import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, Home, Calendar, CalendarDays } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

async function getApplications(userId: string) {
  const applications = await prisma.application.findMany({
    where: {
      housemateId: userId,
    },
    include: {
      product: {
        include: {
          User: {
            include: {
              homeownerProfile: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return applications;
}

export default async function HousemateApplicationsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const applications = await getApplications(user.id);

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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">
            Track your housing applications and their status
          </p>
        </div>
        <Link href="/">
          <Button>
            <Home className="h-4 w-4 mr-2" />
            Browse Properties
          </Button>
        </Link>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't submitted any applications yet. Browse available properties to get started.
            </p>
            <Link href="/">
              <Button>Browse Properties</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">
                      {application.product.name}
                    </CardTitle>
                    <CardDescription>
                      ${application.product.price}/month • {application.product.address}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground">
                      Host: {application.product.User?.firstName} {application.product.User?.lastName}
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(application.status)} flex items-center gap-1`}
                  >
                    {getStatusIcon(application.status)}
                    {application.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stay Duration Section */}
                  {application.moveInDate && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-green-600" />
                        Your Requested Stay Period
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <div>
                            <span className="font-medium">Move-in Date:</span>
                            <br />
                            <span className="text-green-700">
                              {format(new Date(application.moveInDate), "MMMM dd, yyyy")}
                            </span>
                          </div>
                        </div>
                        {application.moveOutDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <div>
                              <span className="font-medium">Move-out Date:</span>
                              <br />
                              <span className="text-green-700">
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

                  {application.message && (
                    <div>
                      <h4 className="font-medium mb-2">Your Message:</h4>
                      <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                        {application.message}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Applied on {new Date(application.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <Link href={`/product/${application.product.id}`}>
                        <Button variant="outline" size="sm">
                          View Property
                        </Button>
                      </Link>
                      {application.status === "APPROVED" && (
                        <Link href={`/billing?application=${application.id}`}>
                          <Button size="sm">
                            Complete Booking
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 