SELECT * FROM `department`;
SELECT * FROM `role`;
SELECT * FROM `employee`;

INSERT INTO `department` (`name`) 
    VALUES ('IT'), ('HR'), ('Sales'), ('Marketing');

INSERT INTO `role` (`title`, `salary`, `department_id`)
    VALUES ('Owner', 100000, 1), ('VP', 100000, 1), ('Manager', 50000, 2), ('Sales Manager', 30000, 3), ('Account Manager', 30000, 4);

INSERT INTO `employee` (`first_name`, `last_name`, `role_id`, `manager_id`)
    VALUES ('John', 'Doe', 1, NULL), ('Jane', 'Doe', 2, 1), ('Joe', 'Doe', 3, 2), ('Jill', 'Doe', 4, 2), ('Jack', 'Doe', 5, 2);