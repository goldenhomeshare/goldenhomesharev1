-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_housemateId_fkey";

-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_homeownerId_fkey";

-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_housemateId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "hiddenByHomeowner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hiddenByHousemate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "homeownerHiddenAt" TIMESTAMP(3),
ADD COLUMN     "housemateHiddenAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_housemateId_fkey" FOREIGN KEY ("housemateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_housemateId_fkey" FOREIGN KEY ("housemateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
