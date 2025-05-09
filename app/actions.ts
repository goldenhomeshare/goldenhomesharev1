"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod"; // ZodStringDef is not imported, addressing the unused var if it was there
import prisma from "./lib/db";
import { type CategoryTypes } from "@prisma/client";
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
    .min(3, { message: "The name has to be a min character length of 3" }), // Corrected typo
  category: z.string().min(1, { message: "Category is required" }),
  price: z.number().min(1, { message: "The Price has to be bigger than 1" }),
  smallDescription: z
    .string()
    .min(10, { message: "Please summarize your product more" }),
  description: z.string().min(10, { message: "Description is required" }), // This is validated as a string
  images: z.array(z.string(), { message: "Images are required" }),
  productFile: z
    .string()
    .min(1, { message: "Please upload a zip of your product" }),
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

export async function SellProduct(
  prevState: State | undefined, // Correctly typed prevState
  formData: FormData
): Promise<State> { // Correctly typed return
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return {
      status: "error",
      message: "You must be logged in to sell a product.",
      errors: {},
    };
  }

  let imagesArray: string[];
  try {
    const imagesString = formData.get("images") as string;
    if (!imagesString) {
        throw new Error("Images data is missing.");
    }
    imagesArray = JSON.parse(imagesString);
    if (!Array.isArray(imagesArray) || !imagesArray.every(item => typeof item === 'string')) {
        throw new Error("Images must be an array of strings.");
    }
  } catch (e: any) {
    return {
      status: "error",
      errors: { images: [e.message || "Invalid image data format."] },
      message: "Oops, there is a mistake with your image inputs.",
    };
  }

  const validateFields = productSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    smallDescription: formData.get("smallDescription"),
    description: formData.get("description"), // Validated as a string by Zod
    images: imagesArray, // Pass the parsed array to Zod
    productFile: formData.get("productFile"),
  });

  if (!validateFields.success) {
    return {
      status: "error",
      errors: validateFields.error.flatten().fieldErrors,
      message: "Oops, I think there is a mistake with your inputs.",
    };
  }

  let parsedDescription;
  try {
    // Assuming validateFields.data.description is a string that needs to be parsed into JSON for DB storage.
    // If your DB 'description' field is just TEXT, remove this JSON.parse() and use validateFields.data.description directly.
    parsedDescription = JSON.parse(validateFields.data.description);
  } catch (e: any) {
    return {
      status: "error",
      errors: { description: [e.message || "Invalid JSON format in description."] },
      message: "Oops, the detailed description has an invalid format.",
    };
  }

  try {
    const createdProduct = await prisma.product.create({
      data: {
        name: validateFields.data.name,
        category: validateFields.data.category as CategoryTypes,
        smallDescription: validateFields.data.smallDescription,
        price: validateFields.data.price,
        images: validateFields.data.images,
        productFile: validateFields.data.productFile,
        userId: user.id,
        description: parsedDescription, // Store the parsed JSON object
      },
    });

    return redirect(`/product/${createdProduct.id}`);
  } catch (dbError: any) {
    return {
      status: "error",
      message: dbError.message || "Failed to create product in database. Please try again.",
      errors: {},
    };
  }
}

export async function UpdateUserSettings(
  prevState: State | undefined, // Correctly typed prevState
  formData: FormData
): Promise<State> { // Correctly typed return
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return {
      status: "error",
      message: "You must be logged in to update settings.",
      errors: {},
    };
  }

  const validateFields = userSettingsSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  if (!validateFields.success) {
    return {
      status: "error",
      errors: validateFields.error.flatten().fieldErrors,
      message: "Oops, I think there is a mistake with your inputs.",
    };
  }

  try {
    // 'data' variable removed as it was unused
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstName: validateFields.data.firstName,
        lastName: validateFields.data.lastName,
      },
    });

    return {
      status: "success",
      message: "Your Settings have been updated",
    };
  } catch (dbError: any) {
    return {
      status: "error",
      message: dbError.message || "Failed to update settings. Please try again.",
      errors: {},
    };
  }
}

export async function BuyProduct(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    console.error("Product ID is missing from form data.");
    return redirect("/payment/error?reason=missingProductId");
  }

  const productData = await prisma.product.findUnique({
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

  if (!productData) {
    console.error(`Product not found for ID: ${id}`);
    return redirect("/payment/error?reason=productNotFound");
  }

  if (!productData.User?.connectedAccountId) {
    console.error(`Seller's Stripe account is not connected for product ID: ${id}`);
    return redirect("/payment/error?reason=sellerAccountNotConnected");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(productData.price * 100),
            product_data: {
              name: productData.name,
              description: productData.smallDescription,
              images: productData.images,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        link: productData.productFile,
      },
      payment_intent_data: {
        application_fee_amount: Math.round(productData.price * 100) * 0.1,
        transfer_data: {
          destination: productData.User.connectedAccountId,
        },
      },
      success_url:
        (process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : process.env.HOST_URL || "https://your-production-url.com") + "/payment/success", // Use HOST_URL for Vercel
      cancel_url:
        (process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : process.env.HOST_URL || "https://your-production-url.com") + "/payment/cancel", // Use HOST_URL for Vercel
    });

    if (!session.url) {
        throw new Error("Failed to create Stripe session URL.");
    }
    return redirect(session.url);
  } catch (stripeError: any) {
    console.error("Stripe session creation failed:", stripeError.message);
    return redirect(`/payment/error?reason=stripeError&message=${encodeURIComponent(stripeError.message)}`);
  }
}

export async function CreateStripeAccoutnLink() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("User not authenticated for Stripe account link creation.");
  }

  const userAccount = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      connectedAccountId: true,
    },
  });

  if (!userAccount?.connectedAccountId) {
    console.error("User does not have a connected Stripe account ID.");
    // Potentially redirect to a page to create/connect a Stripe account first
    // For now, throwing an error or redirecting to a generic error/billing page
    return redirect("/billing?error=no_stripe_id_setup");
  }

  try {
    const accountLink = await stripe.accountLinks.create({
      account: userAccount.connectedAccountId,
      refresh_url:
        (process.env.NODE_ENV === "development"
          ? `http://localhost:3000`
          : process.env.HOST_URL || "https://your-production-url.com") + "/billing",
      return_url:
        (process.env.NODE_ENV === "development"
          ? `http://localhost:3000`
          : process.env.HOST_URL || "https://your-production-url.com") + `/return/${userAccount.connectedAccountId}`,
      type: "account_onboarding",
    });
    return redirect(accountLink.url);
  } catch (stripeError: any) {
    console.error("Stripe account link creation failed:", stripeError.message);
    return redirect(`/billing?error=stripe_link_failed&message=${encodeURIComponent(stripeError.message)}`);
  }
}

export async function GetStripeDashboardLink() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("User not authenticated for Stripe dashboard link.");
  }

  const userAccount = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      connectedAccountId: true,
    },
  });

  if (!userAccount?.connectedAccountId) {
    console.error("User does not have a connected Stripe account ID for dashboard link.");
     return redirect("/billing?error=no_stripe_id_dashboard");
  }
  
  try {
    const loginLink = await stripe.accounts.createLoginLink(
      userAccount.connectedAccountId
    );
    return redirect(loginLink.url);
  } catch (stripeError: any) {
    console.error("Stripe dashboard link creation failed:", stripeError.message);
    return redirect(`/billing?error=stripe_dashboard_failed&message=${encodeURIComponent(stripeError.message)}`);
  }
}