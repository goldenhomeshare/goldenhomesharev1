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
    .min(3, { message: "The name has to be a min charackter length of 5" }),
  category: z.string().min(1, { message: "Category is required" }),
  price: z.number().min(1, { message: "The Price has to be bigger then 1" }),
  smallDescription: z
    .string()
    .min(10, { message: "Please summerize your product more" }),
  description: z.string().min(10, { message: "Description is required" }),
  images: z.array(z.string(), { message: "Images are required" }),
  productFile: z
    .string()
    .min(1, { message: "Please upload a zip of your product" }),
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
    throw new Error("Something went wrong");
  }

  const validateFields = productSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    smallDescription: formData.get("smallDescription"),
    description: formData.get("description"),
    images: JSON.parse(formData.get("images") as string),
    productFile: formData.get("productFile"),
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
    category: validateFields.data.category as CategoryTypes,
    smallDescription: validateFields.data.smallDescription,
    price: validateFields.data.price,
    images: validateFields.data.images,
    productFile: validateFields.data.productFile,
    description: JSON.parse(validateFields.data.description),
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

  const data = await prisma.product.create({
    data: productData,
  });

  return redirect(`/product/${data.id}`);
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
    category: validateFields.data.category as CategoryTypes,
    smallDescription: validateFields.data.smallDescription,
    price: validateFields.data.price,
    images: validateFields.data.images,
    productFile: validateFields.data.productFile,
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
        : "https://marshal-ui-yt.vercel.app/payment/success",
    cancel_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/payment/cancel"
        : "https://marshal-ui-yt.vercel.app/payment/cancel",
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
        : `https://marshal-ui-yt.vercel.app/billing`,
    return_url:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/return/${data?.connectedAccountId}`
        : `https://marshal-ui-yt.vercel.app/return/${data?.connectedAccountId}`,
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