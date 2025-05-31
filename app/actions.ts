"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ZodStringDef, z } from "zod";
import prisma from "./lib/db";
import { CategoryTypes } from "@prisma/client";
import { stripe } from "./lib/stripe";
import { redirect } from "next/navigation";

export type State = {
  status: "error" | "success" | undefined;
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
};

const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "The name has to be a minimum of 3 characters" }),
  category: z.string().optional(),
  price: z.number().min(1, { message: "The Price has to be bigger then 1" }),
  smallDescription: z
    .string()
    .min(10, { message: "Please summarize your listing in at least 10 characters" }),
  description: z.string().min(10, { message: "Description is required" }),
  images: z.array(z.string(), { message: "Images are required" }),
  productFile: z
    .string()
    .optional(),
  address: z.string().min(5, { message: "Please provide a valid address" }),
  amenities: z.array(z.string()).optional(),
  supportRequested: z.array(
    z.union([
      z.string(),
      z.object({
        id: z.string(),
        hoursPerWeek: z.number().min(1).max(40)
      })
    ])
  ).optional(),
  houseRules: z.array(
    z.object({
      id: z.string(),
      value: z.string().optional(),
    })
  ).optional(),
});

const userSettingsSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "Minimum length of 3 required" })
    .or(z.literal(""))
    .optional(),

  lastName: z
    .string()
    .min(3, { message: "Minimum length of 3 required" })
    .or(z.literal(""))
    .optional(),
});

export async function SellProduct(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("User authentication failed");
  }

  // Log the incoming form data for debugging
  console.log("SellProduct received form data:", {
    name: formData.get("name"),
    category: formData.get("category"),
    price: formData.get("price"),
    smallDescription: formData.get("smallDescription"),
    address: formData.get("address"),
    images: formData.get("images"),
    amenities: formData.get("amenities"),
    supportRequested: formData.get("supportRequested"),
    houseRules: formData.get("houseRules"),
  });

  try {
    // Parse JSON fields with better error handling
    let images, amenities, supportRequested, houseRules;
    
    try {
      images = JSON.parse(formData.get("images") as string);
    } catch (e) {
      console.error("Error parsing images JSON:", e);
      const state: State = {
        status: "error",
        message: "Invalid images data format. Please try uploading your images again.",
      };
      return state;
    }

    try {
      amenities = formData.get("amenities") ? JSON.parse(formData.get("amenities") as string) : [];
    } catch (e) {
      console.error("Error parsing amenities JSON:", e);
      const state: State = {
        status: "error",
        message: "Invalid amenities data format. Please try selecting your amenities again.",
      };
      return state;
    }

    try {
      supportRequested = formData.get("supportRequested") ? JSON.parse(formData.get("supportRequested") as string) : [];
    } catch (e) {
      console.error("Error parsing supportRequested JSON:", e);
      const state: State = {
        status: "error",
        message: "Invalid support services data format. Please try selecting support services again.",
      };
      return state;
    }

    try {
      houseRules = formData.get("houseRules") ? JSON.parse(formData.get("houseRules") as string) : [];
    } catch (e) {
      console.error("Error parsing houseRules JSON:", e);
      const state: State = {
        status: "error",
        message: "Invalid house rules data format. Please try setting house rules again.",
      };
      return state;
    }

    const validateFields = productSchema.safeParse({
      name: formData.get("name"),
      category: formData.get("category"),
      price: Number(formData.get("price")),
      smallDescription: formData.get("smallDescription"),
      description: formData.get("description"),
      images: images,
      productFile: formData.get("productFile"),
      address: formData.get("address"),
      amenities: amenities,
      supportRequested: supportRequested,
      houseRules: houseRules,
    });

    if (!validateFields.success) {
      console.error("Validation failed:", validateFields.error.flatten());
      const state: State = {
        status: "error",
        errors: validateFields.error.flatten().fieldErrors,
        message: "Oops, I think there is a mistake with your inputs.",
      };

      return state;
    }

    console.log("Validation successful, creating product with data:", validateFields.data);

    let descriptionParsed;
    try {
      descriptionParsed = JSON.parse(validateFields.data.description);
    } catch (e) {
      console.error("Error parsing description JSON:", e);
      const state: State = {
        status: "error",
        message: "Invalid description format. Please try editing your description again.",
      };
      return state;
    }

    const productData: any = {
      name: validateFields.data.name,
      category: (validateFields.data.category as CategoryTypes) || "template",
      smallDescription: validateFields.data.smallDescription,
      price: validateFields.data.price,
      images: validateFields.data.images,
      productFile: validateFields.data.productFile || "",
      address: validateFields.data.address,
      description: descriptionParsed,
      User: {
        connect: {
          id: user.id
        }
      }
    };

    if (validateFields.data.amenities && validateFields.data.amenities.length > 0) {
      productData.amenities = validateFields.data.amenities;
    }

    if (validateFields.data.supportRequested && validateFields.data.supportRequested.length > 0) {
      productData.supportRequested = validateFields.data.supportRequested;
    }

    if (validateFields.data.houseRules && validateFields.data.houseRules.length > 0) {
      productData.houseRules = validateFields.data.houseRules;
    }

    console.log("Creating product in database with:", productData);

    const data = await prisma.product.create({
      data: productData,
    });

    console.log("Product created successfully with ID:", data.id);

    return redirect(`/product/${data.id}`);
  } catch (error) {
    console.error("Error in SellProduct:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("Invalid JSON")) {
        const state: State = {
          status: "error",
          message: "Invalid data format. Please check your inputs and try again.",
        };
        return state;
      } else if (error.message.includes("Prisma") || error.message.includes("database")) {
        const state: State = {
          status: "error",
          message: "Database error. Please try again later.",
        };
        return state;
      }
    }
    
    // Re-throw the error to be caught by the client-side error handler
    throw error;
  }
}

export async function EditProduct(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Something went wrong");
  }

  const productId = formData.get("productId") as string;

  if (!productId) {
    throw new Error("Product ID is required");
  }

  // Check if user owns this product
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: { userId: true },
  });

  if (!existingProduct || existingProduct.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  const validateFields = productSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    smallDescription: formData.get("smallDescription"),
    description: formData.get("description"),
    images: JSON.parse(formData.get("images") as string),
    productFile: formData.get("productFile"),
    address: formData.get("address"),
    amenities: formData.get("amenities") ? JSON.parse(formData.get("amenities") as string) : [],
    supportRequested: formData.get("supportRequested") ? JSON.parse(formData.get("supportRequested") as string) : [],
    houseRules: formData.get("houseRules") ? JSON.parse(formData.get("houseRules") as string) : [],
  });

  if (!validateFields.success) {
    const state: State = {
      status: "error",
      errors: validateFields.error.flatten().fieldErrors,
      message: "Oops, I think there is a mistake with your inputs.",
    };

    return state;
  }

  const productData: any = {
    name: validateFields.data.name,
    category: (validateFields.data.category as CategoryTypes) || "template",
    smallDescription: validateFields.data.smallDescription,
    price: validateFields.data.price,
    images: validateFields.data.images,
    productFile: validateFields.data.productFile || "",
    address: validateFields.data.address,
    description: JSON.parse(validateFields.data.description),
  };

  if (validateFields.data.amenities && validateFields.data.amenities.length > 0) {
    productData.amenities = validateFields.data.amenities;
  }

  if (validateFields.data.supportRequested && validateFields.data.supportRequested.length > 0) {
    productData.supportRequested = validateFields.data.supportRequested;
  }

  if (validateFields.data.houseRules && validateFields.data.houseRules.length > 0) {
    productData.houseRules = validateFields.data.houseRules;
  }

  await prisma.product.update({
    where: { id: productId },
    data: productData,
  });

  const state: State = {
    status: "success",
    message: "Your listing has been updated successfully!",
  };

  return state;
}

export async function UpdateUserSettings(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("something went wrong");
  }

  const validateFields = userSettingsSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  if (!validateFields.success) {
    const state: State = {
      status: "error",
      errors: validateFields.error.flatten().fieldErrors,
      message: "Oops, I think there is a mistake with your inputs.",
    };

    return state;
  }

  const data = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      firstName: validateFields.data.firstName,
      lastName: validateFields.data.lastName,
    },
  });

  const state: State = {
    status: "success",
    message: "Your Settings have been updated",
  };

  return state;
}

export async function BuyProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const data = await prisma.product.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      smallDescription: true,
      price: true,
      images: true,
      productFile: true,
      User: {
        select: {
          connectedAccountId: true,
        },
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round((data?.price as number) * 100),
          product_data: {
            name: data?.name as string,
            description: data?.smallDescription,
            images: data?.images,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      link: data?.productFile as string,
    },

    payment_intent_data: {
      application_fee_amount: Math.round((data?.price as number) * 100) * 0.1,
      transfer_data: {
        destination: data?.User?.connectedAccountId as string,
      },
    },
    success_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/payment/success"
        : `https://${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'goldenhomeshare.com'}/payment/success`,
    cancel_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/payment/cancel"
        : `https://${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'goldenhomeshare.com'}/payment/cancel`,
  });

  return redirect(session.url as string);
}

export async function CreateStripeAccoutnLink() {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user) {
    throw new Error();
  }

  const data = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      connectedAccountId: true,
    },
  });

  const accountLink = await stripe.accountLinks.create({
    account: data?.connectedAccountId as string,
    refresh_url:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/billing`
        : `https://${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'goldenhomeshare.com'}/billing`,
    return_url:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/return/${data?.connectedAccountId}`
        : `https://${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'goldenhomeshare.com'}/return/${data?.connectedAccountId}`,
    type: "account_onboarding",
  });

  return redirect(accountLink.url);
}

export async function GetStripeDashboardLink() {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user) {
    throw new Error();
  }

  const data = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      connectedAccountId: true,
    },
  });

  const loginLink = await stripe.accounts.createLoginLink(
    data?.connectedAccountId as string
  );

  return redirect(loginLink.url);
}

export async function DeleteProduct(productId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Check if user owns this product
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: { userId: true },
  });

  if (!existingProduct || existingProduct.userId !== user.id) {
    throw new Error("Unauthorized - You can only delete your own listings");
  }

  // Delete the product
  await prisma.product.delete({
    where: { id: productId },
  });

  return { success: true };
}

export async function ProcessApplicationPayment(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const applicationId = formData.get("applicationId") as string;
  
  // Get the approved application and related product data
  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
      housemateId: user.id,
      status: "APPROVED",
    },
    include: {
      product: {
        include: {
          User: {
            select: {
              connectedAccountId: true,
            },
          },
        },
      },
    },
  });

  if (!application) {
    throw new Error("Application not found or not approved");
  }

  const product = application.product;

  // Create checkout session configuration
  const sessionConfig: any = {
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round((product.price as number) * 100),
          product_data: {
            name: `Monthly Contribution - ${product.name}`,
            description: `First month's contribution for ${product.name}`,
            images: product.images,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      applicationId: applicationId,
      productId: product.id,
      housemateId: user.id,
    },
    success_url:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3001/payment/success?application=${applicationId}`
        : `https://${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'goldenhomeshare.com'}/payment/success?application=${applicationId}`,
    cancel_url:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3001/billing?application=${applicationId}`
        : `https://${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'goldenhomeshare.com'}/billing?application=${applicationId}`,
  };

  // Only add payment_intent_data if connected account exists and is properly configured
  // For now, we'll skip the transfer to avoid capability errors
  // TODO: Add proper account capability checking before enabling transfers
  
  const session = await stripe.checkout.sessions.create(sessionConfig);

  return redirect(session.url as string);
}