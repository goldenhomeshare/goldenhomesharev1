import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing({
  errorFormatter: (err) => {
    console.log("Upload error:", err.message);
    return { message: err.message };
  },
});

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        // If you throw, the user will not be able to upload
        if (!user) throw new UploadThingError("Unauthorized");

        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { userId: user.id };
      } catch (error) {
        console.error("Upload middleware error:", error);
        throw new UploadThingError("Authentication failed");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.url);

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
      } catch (error) {
        console.error("Upload completion error:", error);
        throw new UploadThingError("Upload completion failed");
      }
    }),

  profilePictureUpload: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    // Set permissions and file types for profile pictures
    .middleware(async ({ req }) => {
      try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        // If you throw, the user will not be able to upload
        if (!user) throw new UploadThingError("Unauthorized");

        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { userId: user.id };
      } catch (error) {
        console.error("Profile upload middleware error:", error);
        throw new UploadThingError("Authentication failed");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // This code RUNS ON YOUR SERVER after upload
        console.log("Profile picture upload complete for userId:", metadata.userId);
        console.log("file url", file.url);

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
      } catch (error) {
        console.error("Profile upload completion error:", error);
        throw new UploadThingError("Profile upload completion failed");
      }
    }),

  productFileUpload: f({ "application/zip": { maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        // If you throw, the user will not be able to upload
        if (!user) throw new UploadThingError("Unauthorized");

        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { userId: user.id };
      } catch (error) {
        console.error("Product file upload middleware error:", error);
        throw new UploadThingError("Authentication failed");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.url);

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
      } catch (error) {
        console.error("Product file upload completion error:", error);
        throw new UploadThingError("Product file upload completion failed");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
