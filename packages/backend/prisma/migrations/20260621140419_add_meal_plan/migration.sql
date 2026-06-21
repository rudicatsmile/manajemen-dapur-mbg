-- CreateTable
CREATE TABLE `meal_plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `week_start_date` DATE NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    `max_portions_per_day` INTEGER NOT NULL DEFAULT 200,
    `notes` TEXT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `meal_plans_week_start_date_idx`(`week_start_date`),
    INDEX `meal_plans_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_plan_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `meal_plan_id` INTEGER NOT NULL,
    `recipe_id` INTEGER NOT NULL,
    `day_of_week` INTEGER NOT NULL,
    `portions` DECIMAL(15, 3) NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `notes` TEXT NULL,

    INDEX `meal_plan_items_meal_plan_id_idx`(`meal_plan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_plan_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT false,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_plan_template_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `template_id` INTEGER NOT NULL,
    `recipe_id` INTEGER NOT NULL,
    `day_of_week` INTEGER NOT NULL,
    `portions` DECIMAL(15, 3) NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,

    INDEX `meal_plan_template_items_template_id_idx`(`template_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `meal_plans` ADD CONSTRAINT `meal_plans_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_items` ADD CONSTRAINT `meal_plan_items_meal_plan_id_fkey` FOREIGN KEY (`meal_plan_id`) REFERENCES `meal_plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_items` ADD CONSTRAINT `meal_plan_items_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_templates` ADD CONSTRAINT `meal_plan_templates_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_template_items` ADD CONSTRAINT `meal_plan_template_items_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `meal_plan_templates`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plan_template_items` ADD CONSTRAINT `meal_plan_template_items_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
