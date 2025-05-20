
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/route";
const f = createUploadthing();

const handleAuth = async () => {

  const session = await getServerSession(authOption);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return { userId: session.user.id };

};

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileCount: 10, maxFileSize: "32MB" },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(({ metadata, file } ) => {
     console.log({success:true, message:"Image was uploaded with success"  ,metadata:metadata.userId, url:file.ufsUrl})
      
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;