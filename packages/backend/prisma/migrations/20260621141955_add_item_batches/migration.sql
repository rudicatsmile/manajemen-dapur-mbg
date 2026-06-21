-- CreateTable
CREATE TABLE `item_batches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_id` INTEGER NOT NULL,
    `batch_number` VARCHAR(100) NOT NULL,
    `expiry_date` DATE NULL,
    `receiving_item_id` INTEGER NULL,
    `initial_qty` DECIMAL(15, 3) NOT NULL,
    `current_qty` DECIMAL(15, 3) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    `received_date` DATE NOT NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `item_batches_receiving_item_id_key`(`receiving_item_id`),
    INDEX `item_batches_item_id_status_idx`(`item_id`, `status`),
    INDEX `item_batches_expiry_date_idx`(`expiry_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `item_batches` ADD CONSTRAINT `item_batches_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_batches` ADD CONSTRAINT `item_batches_receiving_item_id_fkey` FOREIGN KEY (`receiving_item_id`) REFERENCES `receiving_items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
