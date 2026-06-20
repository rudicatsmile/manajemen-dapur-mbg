-- CreateTable
CREATE TABLE `price_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_id` INTEGER NOT NULL,
    `supplier_id` INTEGER NOT NULL,
    `price` DECIMAL(15, 2) NOT NULL,
    `quantity` DECIMAL(15, 3) NOT NULL,
    `po_id` INTEGER NOT NULL,
    `recorded_at` DATE NOT NULL,

    INDEX `price_history_item_id_idx`(`item_id`),
    INDEX `price_history_supplier_id_idx`(`supplier_id`),
    INDEX `price_history_recorded_at_idx`(`recorded_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `price_history` ADD CONSTRAINT `price_history_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `price_history` ADD CONSTRAINT `price_history_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
