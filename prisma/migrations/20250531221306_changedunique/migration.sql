/*
  Warnings:

  - A unique constraint covering the columns `[userId,houseId]` on the table `Interest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Interest_userId_houseId_key" ON "Interest"("userId", "houseId");
