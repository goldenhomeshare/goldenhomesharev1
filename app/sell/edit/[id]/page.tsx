import { Card } from "@/components/ui/card";
import { EditListingForm } from "../../../components/form/EditListingForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../../../lib/db";
import { redirect, notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

async function getData(listingId: string, userId: string) {
  const listing = await prisma.product.findUnique({
    where: {
      id: listingId,
    },
    select: {
      id: true,
      name: true,
      price: true,
      smallDescription: true,
      description: true,
      images: true,
      productFile: true,
      category: true,
      address: true,
      amenities: true,
      supportRequested: true,
      houseRules: true,
      userId: true,
    },
  });

  if (!listing) {
    return notFound();
  }

  // Check if the current user owns this listing
  if (listing.userId !== userId) {
    return redirect("/my-products");
  }

  return listing;
}

async function checkUserStripeStatus(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      stripeConnectedLinked: true,
    },
  });

  if (data?.stripeConnectedLinked === false) {
    return redirect("/billing");
  }

  return null;
}

export default async function EditListingRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const resolvedParams = await params;
  
  await checkUserStripeStatus(user.id);
  const listing = await getData(resolvedParams.id, user.id);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-14">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Listing</h1>
        <p className="text-muted-foreground">Update your listing information and details.</p>
      </div>
      <Card>
        <EditListingForm listing={listing} />
      </Card>
    </section>
  );
} 