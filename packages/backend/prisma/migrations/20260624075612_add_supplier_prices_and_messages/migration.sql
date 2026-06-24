-- CreateTable
CREATE TABLE `supplier_item_prices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplier_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `unit_id` INTEGER NULL,
    `price` DECIMAL(15, 2) NOT NULL,
    `effective_date` DATE NOT NULL,
    `valid_until` DATE NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `note` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `supplier_item_prices_supplier_id_idx`(`supplier_id`),
    INDEX `supplier_item_prices_item_id_idx`(`item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supplier_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplier_id` INTEGER NOT NULL,
    `po_id` INTEGER NULL,
    `sender_type` VARCHAR(20) NOT NULL,
    `sender_user_id` INTEGER NULL,
    `sender_supplier_user_id` INTEGER NULL,
    `body` TEXT NOT NULL,
    `read_by_internal` BOOLEAN NOT NULL DEFAULT false,
    `read_by_supplier` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `supplier_messages_supplier_id_created_at_idx`(`supplier_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `supplier_item_prices` ADD CONSTRAINT `supplier_item_prices_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supplier_item_prices` ADD CONSTRAINT `supplier_item_prices_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supplier_item_prices` ADD CONSTRAINT `supplier_item_prices_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `units_of_measure`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supplier_messages` ADD CONSTRAINT `supplier_messages_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supplier_messages` ADD CONSTRAINT `supplier_messages_po_id_fkey` FOREIGN KEY (`po_id`) REFERENCES `purchase_orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supplier_messages` ADD CONSTRAINT `supplier_messages_sender_user_id_fkey` FOREIGN KEY (`sender_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supplier_messages` ADD CONSTRAINT `supplier_messages_sender_supplier_user_id_fkey` FOREIGN KEY (`sender_supplier_user_id`) REFERENCES `supplier_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
