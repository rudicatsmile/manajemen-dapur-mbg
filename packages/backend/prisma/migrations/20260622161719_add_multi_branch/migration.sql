/*
  Warnings:

  - Added the required column `branch_id` to the `item_batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `productions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `purchase_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `receivings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `stock_movements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `stock_opnames` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `waste_records` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `item_batches` DROP FOREIGN KEY `item_batches_item_id_fkey`;

-- DropIndex
DROP INDEX `item_batches_item_id_status_idx` ON `item_batches`;

-- AlterTable
ALTER TABLE `item_batches` ADD COLUMN `branch_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `productions` ADD COLUMN `branch_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `purchase_orders` ADD COLUMN `branch_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `receivings` ADD COLUMN `branch_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `stock_movements` ADD COLUMN `branch_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `stock_opnames` ADD COLUMN `branch_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `default_branch_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `waste_records` ADD COLUMN `branch_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `branches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `address` TEXT NULL,
    `phone` VARCHAR(20) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_default` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `branches_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branch_stocks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `branch_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `current_stock` DECIMAL(15, 3) NOT NULL DEFAULT 0,
    `min_stock` DECIMAL(15, 3) NOT NULL DEFAULT 0,

    INDEX `branch_stocks_branch_id_idx`(`branch_id`),
    INDEX `branch_stocks_item_id_idx`(`item_id`),
    UNIQUE INDEX `branch_stocks_branch_id_item_id_key`(`branch_id`, `item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_branches` (
    `user_id` INTEGER NOT NULL,
    `branch_id` INTEGER NOT NULL,

    INDEX `user_branches_branch_id_idx`(`branch_id`),
    PRIMARY KEY (`user_id`, `branch_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_transfers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transfer_number` VARCHAR(50) NOT NULL,
    `from_branch_id` INTEGER NOT NULL,
    `to_branch_id` INTEGER NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
    `request_date` DATE NOT NULL,
    `notes` TEXT NULL,
    `requested_by` INTEGER NOT NULL,
    `approved_by` INTEGER NULL,
    `approved_at` DATETIME(3) NULL,
    `shipped_by` INTEGER NULL,
    `shipped_at` DATETIME(3) NULL,
    `received_by` INTEGER NULL,
    `received_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `stock_transfers_transfer_number_key`(`transfer_number`),
    INDEX `stock_transfers_from_branch_id_idx`(`from_branch_id`),
    INDEX `stock_transfers_to_branch_id_idx`(`to_branch_id`),
    INDEX `stock_transfers_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_transfer_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transfer_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `unit_id` INTEGER NOT NULL,
    `requested_qty` DECIMAL(15, 3) NOT NULL,
    `shipped_qty` DECIMAL(15, 3) NULL,
    `received_qty` DECIMAL(15, 3) NULL,
    `notes` TEXT NULL,

    INDEX `stock_transfer_items_transfer_id_idx`(`transfer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `item_batches_branch_id_item_id_status_idx` ON `item_batches`(`branch_id`, `item_id`, `status`);

-- CreateIndex
CREATE INDEX `productions_branch_id_idx` ON `productions`(`branch_id`);

-- CreateIndex
CREATE INDEX `purchase_orders_branch_id_idx` ON `purchase_orders`(`branch_id`);

-- CreateIndex
CREATE INDEX `receivings_branch_id_idx` ON `receivings`(`branch_id`);

-- CreateIndex
CREATE INDEX `stock_movements_branch_id_idx` ON `stock_movements`(`branch_id`);

-- CreateIndex
CREATE INDEX `stock_opnames_branch_id_idx` ON `stock_opnames`(`branch_id`);

-- CreateIndex
CREATE INDEX `waste_records_branch_id_idx` ON `waste_records`(`branch_id`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_default_branch_id_fkey` FOREIGN KEY (`default_branch_id`) REFERENCES `branches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branch_stocks` ADD CONSTRAINT `branch_stocks_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branch_stocks` ADD CONSTRAINT `branch_stocks_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_branches` ADD CONSTRAINT `user_branches_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_branches` ADD CONSTRAINT `user_branches_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_orders` ADD CONSTRAINT `purchase_orders_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receivings` ADD CONSTRAINT `receivings_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_opnames` ADD CONSTRAINT `stock_opnames_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productions` ADD CONSTRAINT `productions_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `waste_records` ADD CONSTRAINT `waste_records_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_batches` ADD CONSTRAINT `item_batches_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfers` ADD CONSTRAINT `stock_transfers_from_branch_id_fkey` FOREIGN KEY (`from_branch_id`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfers` ADD CONSTRAINT `stock_transfers_to_branch_id_fkey` FOREIGN KEY (`to_branch_id`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfers` ADD CONSTRAINT `stock_transfers_requested_by_fkey` FOREIGN KEY (`requested_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfers` ADD CONSTRAINT `stock_transfers_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfers` ADD CONSTRAINT `stock_transfers_shipped_by_fkey` FOREIGN KEY (`shipped_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfers` ADD CONSTRAINT `stock_transfers_received_by_fkey` FOREIGN KEY (`received_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfer_items` ADD CONSTRAINT `stock_transfer_items_transfer_id_fkey` FOREIGN KEY (`transfer_id`) REFERENCES `stock_transfers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfer_items` ADD CONSTRAINT `stock_transfer_items_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfer_items` ADD CONSTRAINT `stock_transfer_items_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `units_of_measure`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
