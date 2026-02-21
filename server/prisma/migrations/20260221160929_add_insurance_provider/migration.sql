/*
  Warnings:

  - You are about to drop the column `category` on the `accessory` table. All the data in the column will be lost.
  - You are about to drop the column `shopeeUrl` on the `accessory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Accessory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Insurance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `affiliateUrl` to the `Accessory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Accessory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Accessory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Insurance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Insurance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Insurance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accessory` DROP COLUMN `category`,
    DROP COLUMN `shopeeUrl`,
    ADD COLUMN `affiliateUrl` TEXT NOT NULL,
    ADD COLUMN `description` LONGTEXT NULL,
    ADD COLUMN `salePrice` VARCHAR(191) NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `price` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `insurance` ADD COLUMN `shortSummary` VARCHAR(191) NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `thumbnail` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `provider` VARCHAR(191) NULL,
    MODIFY `price` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Accessory_slug_key` ON `Accessory`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Insurance_slug_key` ON `Insurance`(`slug`);
