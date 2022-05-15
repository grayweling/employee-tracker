const inquirer = require('inquirer');
const db = require('../db/connection');
const cTable = require('console.table');

class Company {
    constructor() {
        this.departments = [];
        this.roles = [];
        this.employees = [];
    }
}

Company.prototype.seedDatabase = async function () {
    const getDepartments = await db
        .promise()
        .query(`SELECT * FROM department`)
        .then(res => {
            this.departments = res[0];
        });

    const getRoles = await db
        .promise()
        .query(`SELECT * FROM role`)
        .then(res => {
            this.roles = res[0];
        });

    const getEmployees = await db
        .promise()
        .query(`SELECT * FROM employee`)
        .then(res => {
            this.employees = res[0];
        })
}

Company.prototype.showDepartments = async function () {
    console.clear();
    const getTable = await db
        .promise()
        .query(`SELECT * FROM department`)
        .then(([rows, fields]) => {
            console.table(rows);
        })
}

Company.prototype.showRoles = async function () {
    console.clear();
    const getTable = await db
        .promise()
        .query(
            `SELECT role.id, role.title, role.salary, department.name
            AS department
            FROM role
            LEFT JOIN department
            ON role.department_id = department.id`)
        .then(([rows, fields]) => {
            console.table(rows);
        })
}

Company.prototype.showEmployees = async function () {
    console.clear();
    const getTable = await db
        .promise()
        // .query(
        //     `SELECT employee.id, employee.first_name, employee.last_name
        //     role.title AS role,
        //     department.name AS department,
        //     role.salary AS salary,
        //     CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        //     FROM employee
        //     INNER JOIN role ON employee.role_id = role.id
        //     INNER JOIN department ON role.department_id = department.id
        //     LEFT JOIN employee manager ON manager.id = employee.manager_id
        //     ORDER BY employee.id`)
        .query(
            `SELECT e.id,
        e.first_name,
        e.last_name,
        role.title AS job_title,
        department.name AS department,
        role.salary AS salary,
        CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        INNER JOIN role ON e.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        LEFT JOIN employee m ON m.id = e.manager_id
        ORDER BY id`
          )
        .then(([rows, fields]) => {
            console.table(rows);
        })
}

Company.prototype.addDepartment = async function () {
    const departments = this.departments.map((department) => {
        return department.name;
    });

    const prompt = await inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
                validate: (input) => {
                    if (input === '') {
                        return 'Please enter a department name.';
                    } else if (departments.includes(input)) {
                        return 'That department already exists.';
                    }
                    return true;
                }
            }
        ])
        .then((data) => {
            db.query(`INSERT INTO department (name) VALUES ('${data.department}')`);
            return data
        })
        .then((data) => {
            this.seedDatabase();
            const msg = `${data.department} department added.`;
            this.menu(msg);
        })

}

Company.prototype.addRole = async function () {
    const departments = this.departments.map((department) => {
        return department.name;
    })
    const departmentsId = this.departments.map((department) => {
        return department.id;
    })

    const prompt = await inquirer
        .prompt([
            {
                type: 'input',
                name: 'role',
                message: 'What is the name of the role?',
            },
            {
                type: 'number',
                name: 'salary',
                message: 'What is the salary of the role?',
            },
            {
                type: 'list',
                name: 'department',
                message: 'What department does the role belong to?',
                choices: departments
            }
        ])
        .then(async (data) => {
            await db.promise().query(`INSERT INTO role (title, salary, department_id) VALUES ('${data.role}', ${data.salary}, ${departmentsId[departments.indexOf(data.department)]})`);
            return data
        })
        .then((data) => {
            this.seedDatabase();
            const msg = `${data.role} role added.`;
            this.menu(msg);
        })
}

Company.prototype.addEmployee = async function () {
    const roles = this.roles.map((role) => {
        return role.title;
    })
    const rolesId = this.roles.map((role) => {
        return role.id;
    })
    const manager = this.employees.map((employee) => {
        return `${employee.first_name} ${employee.last_name}`;
    })
    const managerId = this.employees.map((employee) => {
        return employee.id;
    })

    const prompt = await inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is the first name of the employee?',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the last name of the employee?',
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the role of the employee?',
                choices: roles
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is the manager of the employee?',
                choices: manager
            }
        ])
        .then(async (data) => {
            await db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${data.first_name}', '${data.last_name}', ${rolesId[roles.indexOf(data.role)]}, ${managerId[manager.indexOf(data.manager)]})`);
            return data
        })
        .then((data) => {
            this.seedDatabase();
            const msg = `${data.first_name} ${data.last_name} added.`;
            this.menu(msg);
        })
}

Company.prototype.updateEmployeeRole = async function () {
    const employees = this.employees.map((employee) => {
        return `${employee.first_name} ${employee.last_name}`;
    })
    const employeesId = this.employees.map((employee) => {
        return employee.id;
    })
    const roles = this.roles.map((role) => {
        return role.title;
    })
    const rolesId = this.roles.map((role) => {
        return role.id;
    })

    const prompt = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to update?',
                choices: employees
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the new role of the employee?',
                choices: roles
            }
        ])
        .then(async (data) => {
            await db.promise().query(`UPDATE employee SET role_id = ${rolesId[roles.indexOf(data.role)]} WHERE id = ${employeesId[employees.indexOf(data.employee)]}`);
            return data
        })
        .then((data) => {
            this.seedDatabase();
            const msg = `${data.employee}'s role updated.`;
            this.menu(msg);
        })
}

Company.prototype.postOptions = function (table) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'Return to Menu',
                    `Add ${table}`,
                    'Exit'
                ]
            }
        ])
        .then((menu) => {
            switch (menu.choice) {
                case 'Return to Menu':
                    this.menu();
                    break;
                case `Add ${table}`:
                    if (table === 'Department') {
                        this.addDepartment();
                    } else if (table === 'Role') {
                        this.addRole();
                    } else if (table === 'Employee') {
                        this.addEmployee();
                    }
                    break;
                case 'Exit':
                    process.exit();
            }
        })
}

Company.prototype.exitProgram = function () {
    console.log('Goodbye!');
    process.exit();
}

Company.prototype.menu = async function (msg) {
    console.clear();
    if (msg) {
        console.log(msg);
    }

    const prompt = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'View all employees',
                    'View all roles',
                    'View all departments',
                    'Add department',
                    'Add role',
                    'Add employee',
                    'Update employee role',
                    'Exit'
                ]
            }
        ])
        .then((menu) => {
            switch (menu.choice) {
                case 'View all employees':
                    this.showEmployees()
                        .then(() => {
                            this.postOptions('Employee');
                        })
                    break;
                case 'View all roles':
                    this.showRoles()
                        .then(() => {
                            this.postOptions('Role');
                        })
                    break;
                case 'View all departments':
                    this.showDepartments()
                        .then(() => {
                            this.postOptions('Department');
                        })
                    break;
                case 'Add department':
                    this.addDepartment();
                    break;
                case 'Add role':
                    this.addRole();
                    break;
                case 'Add employee':
                    this.addEmployee();
                    break;
                case 'Update employee role':
                    this.updateEmployeeRole();
                    break;
                case 'Exit':
                    this.exitProgram();
            }
        })
}

module.exports = Company;