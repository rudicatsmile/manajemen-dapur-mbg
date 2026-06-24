-- DropForeignKey
ALTER TABLE `purchase_invoices` DROP FOREIGN KEY `purchase_invoices_created_by_fkey`;

-- DropIndex
DROP INDEX `purchase_invoices_created_by_fkey` ON `purchase_invoices`;

-- AlterTable
ALTER TABLE `purchase_invoices` ADD COLUMN `source` VARCHAR(20) NOT NULL DEFAULT 'INTERNAL',
    ADD COLUMN `supplier_user_id` INTEGER NULL,
    MODIFY `created_by` INTEGER NULL;

-- AlterTable
ALTER TABLE `purchase_orders` ADD COLUMN `shipment_note` TEXT NULL,
    ADD COLUMN `shipment_status` VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `shipped_at` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `po_shipment_updates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `po_id` INTEGER NOT NULL,
    `status` VARCHAR(30) NOT NULL,
    `note` TEXT NULL,
    `eta` DATE NULL,
    `created_by_supplier_user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `po_shipment_updates_po_id_idx`(`po_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `po_shipment_updates` ADD CONSTRAINT `po_shipment_updates_po_id_fkey` FOREIGN KEY (`po_id`) REFERENCES `purchase_orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `po_shipment_updates` ADD CONSTRAINT `po_shipment_updates_created_by_supplier_user_id_fkey` FOREIGN KEY (`created_by_supplier_user_id`) REFERENCES `supplier_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_invoices` ADD CONSTRAINT `purchase_invoices_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_invoices` ADD CONSTRAINT `purchase_invoices_supplier_user_id_fkey` FOREIGN KEY (`supplier_user_id`) REFERENCES `supplier_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
