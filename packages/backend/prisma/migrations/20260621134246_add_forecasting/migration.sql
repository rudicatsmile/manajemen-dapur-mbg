-- CreateTable
CREATE TABLE `seasonal_factors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `multiplier` DECIMAL(5, 2) NOT NULL DEFAULT 1,
    `scope` VARCHAR(20) NOT NULL DEFAULT 'GLOBAL',
    `category_id` INTEGER NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `seasonal_factors_start_date_end_date_idx`(`start_date`, `end_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `demand_forecasts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_id` INTEGER NOT NULL,
    `forecast_date` DATE NOT NULL,
    `horizon_days` INTEGER NOT NULL,
    `predicted_qty` DECIMAL(15, 3) NOT NULL,
    `safety_stock` DECIMAL(15, 3) NOT NULL,
    `confidence` VARCHAR(20) NOT NULL,
    `actual_qty` DECIMAL(15, 3) NULL,
    `generated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `generated_by` INTEGER NOT NULL,

    INDEX `demand_forecasts_item_id_idx`(`item_id`),
    INDEX `demand_forecasts_forecast_date_idx`(`forecast_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `seasonal_factors` ADD CONSTRAINT `seasonal_factors_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `demand_forecasts` ADD CONSTRAINT `demand_forecasts_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `demand_forecasts` ADD CONSTRAINT `demand_forecasts_generated_by_fkey` FOREIGN KEY (`generated_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
