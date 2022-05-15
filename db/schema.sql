DROP TABLE IF EXISTS `employee`;
DROP TABLE IF EXISTS `role`;
DROP TABLE IF EXISTS `department`;

CREATE TABLE `department` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `role` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(30) NOT NULL,
    `salary` DECIMAL NOT NULL,
    `department_id` INT(11) NOT NULL,
        FOREIGN KEY (`department_id`) REFERENCES `department` (`id`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `employee` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(30) NOT NULL,
    `last_name` VARCHAR(30) NOT NULL,
    `role_id` INT(11) NOT NULL,
        FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
    `manager_id` INT(11),
        FOREIGN KEY (`manager_id`) REFERENCES `employee` (`id`),
    PRIMARY KEY (`id`)
);
