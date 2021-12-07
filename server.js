//Import Needed Classes for Project
const connection = require('./config/connection');
const cTable = require('console.table');
const figlet = require('figlet');
const validator = require('./public/validate');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');



//Establish connection to Database and show Start Title
connection.connect((err) => {
    if (err) throw err;
    console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
    console.log("");
    //Use figlet for Title screen in brightGreen from chalk
    console.log(chalk.greenBright.bold(figlet.textSync('Employee Tracker')));
    console.log(`                                                          ` + chalk.greenBright.bold('Built By: Joseph Spann'));
    console.log("");
    console.log(chalk.magentaBright("For best functionality, add deprtment first, then role, then employee for new entries"));
    console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
    promptUser();
})

//Prompt user with choices
const titlePrompt = [{
    name: 'choices',
    type: 'list',
    message: 'Select an option:',
    choices: [
        'View All Employees',
        'View All Roles',
        'View All Departments',
        'View Employees by Department',
        'View Department Budgets',
        'Update Employee Role',
        'Update Employee Manager',
        'Add Employee',
        'Add Role',
        'Add Department',
        'Remove Department',
        'Remove Role',
        'Remove Employee',
        'Exit'
    ]
}]
//PromptUser method for main menu
const promptUser = () => {
    //Inquirer prompt
    inquirer.prompt(titlePrompt)
        .then((userAnswers) => {
            const { choices } = userAnswers;
            //Switch Statement to determine what to do with users choice
            switch (choices) {

                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'View Employees by Department':
                    viewEmployeesByDepartment();
                    break;
                case 'Add Employee':
                    addAnEmployee();
                    break;
                case 'Remove Employee':
                    removeAnEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'Update Employee Manager':
                    updateEmployeeManager();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Remove Role':
                    removeRole();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'View Department Budgets':
                    viewDepartmentBudgets();
                    break;
                case 'Remove Department':
                    removeDepartment();
                    break;
                case 'Exit':
                    connection.end();
                    break;
                // case 'Seed Table':
                //     seedTheTable();
                //     break;
                default:
                    console.log('There seems to be an error here check your code dumby!');
            }
        });
};
//Seed Table Method Trying to get it to work but Strings are hard
// const seedTheTable = () => {
//     let schemaSql = fs.readFileSync('./db/schema.sql').toString();
//     schemaSql = schemaSql.replace(/[\r\n]+/g,"");
//     schemaSql = schemaSql.replace("    ", "");
//     connection.query(schemaSql, (err) => {
//         if (err) throw err;
//         console.log(chalk.greenBright('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'));
//         console.log(chalk.greenBright('Schema Has Been Chosen'));
//     })

//     let seedSql = fs.readFileSync('./db/seed.sql').toString().trim();
//     seedSql = seedSql.replace(/[\r\n]+/g,"");
//     seedSql = seedSql.replace("    ", "");
//     connection.query(seedSql, (err)=>{
//         if(err) throw err
//         console.log(chalk.greenBright('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'));
//         console.log(chalk.greenBright('Table Has Been Seeded'));
//     })

// }

//VIEW SECTION HERE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//View All Departments method
const viewAllDepartments = () => {
    console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
    console.log(`                              ` + chalk.green.bold(`All Departments:`));
    console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
    //SQL Statement
    const sqlStatement = `SELECT department_tbl.id AS id, department_tbl.department_name AS department FROM department_tbl`
    //Connection to SQL
    connection.query(sqlStatement, (err, response) => {
        if (err) throw err;

        if (response.length === 0) {
            console.log(chalk.red.bold('There are no departments yet, please add one first'))
            promptUser();
        } else {
            
            console.table(response);
            console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
            promptUser();
        }

    })
}
//View All Employees method
const viewAllEmployees = () => {
    //SQL Statement to grab employee first and last name, role title department and salary
    console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
    console.log(`                              ` + chalk.green.bold(`Current Employees:`));
    console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
    let sqlStatement = `SELECT employee_tbl.id,
                employee_tbl.first_name,
                employee_tbl.last_name,
                role_tbl.title,
                department_tbl.department_name AS 'department',
                role_tbl.salary
                FROM employee_tbl, role_tbl, department_tbl
                WHERE department_tbl.id = role_tbl.department_id
                AND role_tbl.id = employee_tbl.role_id
                ORDER BY employee_tbl.id ASC`;
    //Send query get back a response which is a table
    connection.query(sqlStatement, (err, response) => {
        if (err) throw err;
        if (response.length === 0) {
            console.log(chalk.red.bold('There are no employees yet, please add one'));
            promptUser();

        } else {

            console.table(response);
            console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
            promptUser();
        }

    })
}
//View All Roles Method
const viewRoles = () => {
    console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
    console.log(`                              ` + chalk.green.bold(`Current Employee Roles:`));
    console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
    const sqlStatement = `SELECT role_tbl.id, role_tbl.title, department_tbl.department_name AS department
                            FROM role_tbl
                            INNER JOIN department_tbl ON role_tbl.department_id = department_tbl.id`;
    //Connect to my sql run statement
    connection.query(sqlStatement, (err, response) => {
        if (err) throw err;
        if (response.length === 0) {
            console.log(chalk.red.bold('There are no roles yet, please add one first'));
            promptUser();
        } else {
            response.forEach((role) => { console.log(role.title); });

            console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
            promptUser();
        }

    })
}
//View Department Budgets. Adds Salaries together depending on department
const viewDepartmentBudgets = () => {
    console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
    console.log(`                              ` + chalk.green.bold(`Budget By Department:`));
    console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
    const sqlStatement = `SELECT department_id AS id,
                            department_tbl.department_name AS department,
                            SUM(salary) AS budget
                            FROM role_tbl
                            INNER JOIN department_tbl ON  role_tbl.department_id = department_tbl.id GROUP BY role_tbl.department_id`;
    connection.query(sqlStatement, (err, response) => {
        if (err) throw err;
        console.table(response);
        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
        promptUser();
    });
};
//View All EMployees by Department
const viewEmployeesByDepartment = () => {
    const sqlStatement = `SELECT employee_tbl.first_name,
                            employee_tbl.last_name,
                            department_tbl.department_name AS department
                            FROM employee_tbl
                            LEFT JOIN role_tbl ON employee_tbl.role_id = role_tbl.id
                            LEFT JOIN department_tbl ON role_tbl.department_id = department_tbl.id`;
    connection.query(sqlStatement, (err, response) => {
        if (err) throw err;
        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
        console.log(`                              ` + chalk.green.bold(`Employee Departments:`));
        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
        console.table(response);
        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
        promptUser();
    });
};
//ADD SECTION HERE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Add New Employee Method
const addAnEmployee = () => {
    //Prompt Object Array (2 Prompts)
    const namePrompt = [
        {
            type: 'input',
            name: 'firstName',
            message: "Enter the employee's first name ",
            validate: addFirstName => {
                if (addFirstName) {
                    return true;
                } else {
                    console.log('Please enter a valid first name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Enter the employee's last name",
            validate: addLastName => {
                if (addLastName) {
                    return true;
                } else {
                    console.log('Please enter a valid last name!');
                    return false;
                }
            }
        }];
    //Use inquirer for user input    
    inquirer.prompt(namePrompt)
        .then((answer) => {
            //Array for SQL Statement inputs
            const critArray = [answer.firstName, answer.lastName];
            //Get the role table information
            const roleTblSql = `SELECT role_tbl.id, role_tbl.title FROM role_tbl`;
            //Connect to MySQL
            connection.query(roleTblSql, (err, data) => {
                if (err) throw err;
                //Array to hold roles returned from SQL query
                const roles = data.map(({ id, title }) => ({ name: title, value: id }));
                if (roles.length === 0) {
                    console.log(chalk.red.bold("THERE ARE NO ROLES YET PLEASE ADD ONE"));
                    promptUser();
                    return;
                }
                else {

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "Enter in the employee's role",
                            choices: roles
                        }
                    ]).then(roleChoice => {
                        const role = roleChoice.role;
                        //Push to the critArray 
                        critArray.push(role);
                        //Get employee data to choose manager
                        const managerTblSql = `SELECT * FROM employee_tbl`;
                        //Connect to sql
                        connection.query(managerTblSql, (err, data) => {
                            if (err) throw err;
                            //Map SQL table data into an array, prompt user with list of people
                            const managersArray = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                            //In case someone does not have manager
                            managersArray.push('None');
                            const managerPrompt = [
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Enter in the employee's manager",
                                    choices: managersArray
                                }
                            ]
                            //Inquirer prompt
                            inquirer.prompt(managerPrompt)
                                .then(managerChoice => {


                                    //Holds users choice for manager
                                    const manager = managerChoice.manager;
                                    //If no manager 
                                    if (manager === 'None') {
                                        //Dont push to the array and only input 3 values in SQL statement
                                        const sqlStatement = `INSERT INTO employee_tbl (first_name, last_name, role_id)
                                                                VALUES(?, ?, ?)`;
                                        connection.query(sqlStatement, critArray, (err) => {
                                            if (err) throw err;
                                            console.log('This Employee Has Been Added!');
                                            viewAllEmployees();
                                        })
                                        //If not 'none',
                                    } else {
                                        // then push new manager to crit Array and pass in 4 values for SQL statement
                                        critArray.push(manager);
                                        const sqlStatement = `INSERT INTO employee_tbl (first_name, last_name, role_id, manager_id)
                                                                VALUES(?, ?, ?, ?)`;
                                        connection.query(sqlStatement, critArray, (err) => {
                                            if (err) throw err;
                                            console.log('This Employee Has Been Added!');
                                            viewAllEmployees();
                                        });
                                    }

                                });
                        })
                    });
                }

                //Take users choice from prompt




            });
        });
};
//ADD Department Method
const addDepartment = () => {

    const addDeptPrompt = [
        {
            name: 'newDepartment',
            type: 'input',
            message: 'What is the name of your new Department?',
            validate: validator.validateString
        }
    ]
    //Prompt user input 
    inquirer.prompt(addDeptPrompt)
        .then((answer) => {
            //Insert into the department table the users passed in value
            let sqlStatement = `INSERT INTO department_tbl (department_name) VALUES(?)`;
            connection.query(sqlStatement, answer.newDepartment, (err, response) => {
                if (err) throw err;
                console.log("");
                console.log(chalk.greenBright(answer.newDepartment + ` Department successfully created!`));
                console.log("");
                viewAllDepartments();
            });
        });
};
//Add new Role method
const addRole = () => {
    //Grabbing department data for adding the role
    const sqlStatement = 'SELECT * FROM department_tbl'
    //Connect to sql
    connection.query(sqlStatement, (err, response) => {
        if (err) throw err;
        //Array to hold list of departments
        let deptNameArray = [];
        //Map out the response data from sql statement in the array
        response.forEach((department) => { deptNameArray.push(department.department_name); });
        //Create choice for creating a new Department
        deptNameArray.push('Create New Department');
        //Prompt user
        inquirer.prompt([
            {
                name: 'departmentName',
                type: 'list',
                message: 'Which department is this new role in?',
                choices: deptNameArray
            }
        ])
            .then((answer) => {
                //If user chooses to create a new department, then run the addDepartment method
                if (answer.departmentName === 'Create New Department') {
                    addDepartment();
                } else {
                    //If user chooses anything else, then add the role and resume getting info. 
                    addRoleResume(answer);
                }
            });

        //Add role and resume method
        const addRoleResume = (departmentData) => {
            //Prompt user for new role and salary
            inquirer.prompt([
                {
                    name: 'newRole',
                    type: 'input',
                    message: 'What is the name of your new role?',
                    validate: validator.validateString
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary of this new role?',
                    validate: validator.validateSalary
                }
            ])
                .then((answer) => {
                    //Take user input and store in a variable
                    let createdRole = answer.newRole;
                    let departmentId;

                    //For each row returned from response, set the Department ID
                    response.forEach((department) => {
                        if (departmentData.departmentName === department.department_name) {
                            departmentId = department.id;
                        }
                    });
                    //Another sql statement to insert into the database
                    let sqlStatement2 = `INSERT INTO role_tbl (title, salary, department_id) VALUES (?, ?, ?)`;
                    //Create an array to hold user input and push into the sql table
                    let critArray = [createdRole, answer.salary, departmentId];

                    //Connect to sql
                    connection.query(sqlStatement2, critArray, (err) => {
                        if (err) throw err;
                        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                        console.log(chalk.greenBright(`Role successfully created!`));
                        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                        viewRoles();
                    });
                });
        };
    });
};

//UPDATE SECTION STARTS HERE~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Update Employee Role
const updateEmployeeRole = () => {
    //SQL statement to grab a ton of info from all 3 tables in the database
    let sqlStatement = `SELECT employee_tbl.id, employee_tbl.first_name, employee_tbl.last_name, role_tbl.id AS 'role_id' 
    FROM employee_tbl, role_tbl, department_tbl WHERE department_tbl.id = role_tbl.department_id AND role_tbl.id = employee_tbl.role_id`;

    //Connect using above sql statement
    connection.query(sqlStatement, (err, res) => {
        if (err) throw err;
        //Array to hold employee names
        let employeeNameArray = [];

        //For each row on the response push to the employee name array
        res.forEach((employee) => { employeeNameArray.push(`${employee.first_name} ${employee.last_name}`); });
        //Statament to grab roles
        let sqlRoleTbl = `SELECT role_tbl.id, role_tbl.title FROM role_tbl`;
        connection.query(sqlRoleTbl, (err, response) => {
            if (err) throw err;
            //Array to hold roles
            let roleArray = [];

            //For each row returned from SQL statement push that role to the array
            response.forEach((role) => { roleArray.push(role.title); });

            //Update Prompt Object Array
            const updateRolePrompt = [
                {
                    name: 'chosenEmployee',
                    type: 'list',
                    message: 'Which employee has a new role?',
                    choices: employeeNameArray
                },
                {
                    name: 'chosenRole',
                    type: 'list',
                    message: 'What is their new role?',
                    choices: roleArray
                }
            ]
            //Prompt the user
            inquirer.prompt(updateRolePrompt)
                .then((answer) => {
                    let newTitleId, employeeId;

                    //For each response from the role sql statement
                    response.forEach((role) => {
                        //Check to grab id of new role
                        if (answer.chosenRole.trim() === role.title.trim()) {

                            newTitleId = role.id;

                        }
                    });
                    //For each response from the employee sql statement
                    res.forEach((employee) => {
                        //Variable to hold full name
                        const fullName = `${employee.first_name} ${employee.last_name}`
                        //Check the list of employees to grab the chosen employee's id
                        if (answer.chosenEmployee.trimEnd() === fullName.trimEnd()) {
                            employeeId = employee.id;
                            //Testing
                            // console.log(employeeId);
                        }

                    });
                    //SQL statement to update the tables in the database
                    let sqlUpdate = `UPDATE employee_tbl SET employee_tbl.role_id = ? WHERE employee_tbl.id = ?`;
                    //Pass in the newRoles ID and the chosen employees id to update sql statement
                    connection.query(sqlUpdate, [newTitleId, employeeId], (err) => {
                        if (err) throw err;
                        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                        console.log(chalk.greenBright(`Employee Role Updated`));
                        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                        viewAllEmployees();
                    });



                });
        });
    });
};
//Update Employee Manager
const updateEmployeeManager = () => {
    //Grabbing employee data from table
    let sqlStatement = `SELECT employee_tbl.id, employee_tbl.first_name, employee_tbl.last_name, employee_tbl.manager_id
                        FROM employee_tbl`;
    //Connect to sql and get above data
    connection.query(sqlStatement, (err, response) => {
        //Array to hold employee names
        let employeeNameArray = [];
        //For each row returned from sql statement, push to the emplyee name array
        response.forEach((employee) => { employeeNameArray.push(`${employee.first_name} ${employee.last_name}`); });

        //Update Manager Prompt
        const updateManagerPrompt = [
            {
                name: 'chosenEmployee',
                type: 'list',
                message: 'Which employee has a new manager?',
                choices: employeeNameArray
            },
            {
                name: 'newManager',
                type: 'list',
                message: 'Who is their manager?',
                choices: employeeNameArray
            }
        ]
        //Prompt User
        inquirer.prompt(updateManagerPrompt)
            .then((answer) => {
                //Variables to hold chosen employee id and manager employees id
                let employeeId, managerId;
                response.forEach((employee) => {
                    //Find which eomployee was chosen and grab there ID
                    if (answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`) {
                        employeeId = employee.id;
                    }
                    //Find whicih employee was chosen as manager and grab their id
                    if (answer.newManager === `${employee.first_name} ${employee.last_name}`) {
                        managerId = employee.id;
                    }
                });
                //Validate if chosen employee and manager are the same person or not
                if (validator.isEqual(answer.chosenEmployee, answer.newManager)) {
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    console.log(chalk.redBright(`Invalid Manager Selection`));
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    promptUser();
                } else {
                    //UPDATE sql statement
                    let sqlStatement = `UPDATE employee_tbl SET employee_tbl.manager_id = ? WHERE employee_tbl.id = ?`;
                    //Pass in chosen manager id and chosen employee id into SQL update statement
                    connection.query(sqlStatement, [managerId, employeeId], (err) => {
                        if (err) throw err;
                        console.log(chalk.greenBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                        console.log(chalk.greenBright(`Employee Manager Updated`));
                        console.log(chalk.greenBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                        promptUser();
                    }
                    );
                }
            });
    });
};

//REMOVE SECTION STARTS HERE
//Remove an employee method
const removeAnEmployee = () => {
    //Get employee name data from sql
    let sqlStatement = `SELECT employee_tbl.id, employee_tbl.first_name, employee_tbl.last_name FROM employee_tbl`;
    //connect to sql
    connection.query(sqlStatement, (err, response) => {
        if (err) throw err;
        //Array to hold employee names
        let employeeNameArray = []
        response.forEach((employee) => { employeeNameArray.push(`${employee.first_name} ${employee.last_name}`); });
        //Remove employee prompt 
        const removeEmployeePrompt = [
            {
                name: 'chosenEmployee',
                type: 'list',
                message: 'Which employee would you like to remove?',
                choices: employeeNameArray
            }
        ]
        //Prompt user
        inquirer.prompt(removeEmployeePrompt)
            .then((answer) => {
                let employeeId;
                //For each row returned in response
                response.forEach((employee) => {
                    //Check where the id of the employee that was chosen for a match
                    if (answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`) {
                        employeeId = employee.id;
                    }
                });
                //Deleate statement for chosen employee
                let sqlStatement = "DELETE FROM employee_tbl WHERE employee_tbl.id = ?";

                ///Pass chosen employee into sql delete statement
                connection.query(sqlStatement, [employeeId], (err) => {
                    if (err) throw err;
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    console.log(chalk.redBright(`Employee Successfully Removed`));
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    viewAllEmployees();
                });
            });
    });
};

//Remove a Department
const removeDepartment = () => {
    //Grab department info from tables
    let sqlStatement = `SELECT department_tbl.id, department_tbl.department_name FROM department_tbl`;
    //Connect to sql 
    connection.query(sqlStatement, (err, response) => {
        if (err) throw err;
        //Array to hold deprtments
        let departmentArray = [];
        //For each row returned from sql statement, push the name of that department to the department array
        response.forEach((department) => { departmentArray.push(department.department_name); });

        //Remove Dept Prompt
        const removeDeptPrompt = [
            {
                name: 'chosenDept',
                type: 'list',
                message: 'Which department would you like to remove?',
                choices: departmentArray
            }
        ];

        //Prompt the user
        inquirer.prompt(removeDeptPrompt)
            .then((answer) => {
                //Hold chosen depertment id
                let departmentId;

                //For each row returned from sql statement, 
                response.forEach((department) => {
                    //Check where the chosen deprtments matches and grab the id. 
                    if (answer.chosenDept === department.department_name) {
                        departmentId = department.id;
                    }
                });

                //Delete statemenets the takes in 1 parameter
                let sqlStatement = "DELETE FROM department_tbl WHERE department_tbl.id = ?";

                //Connect to sql pass in chosen deprtment id to delete sql statement
                connection.query(sqlStatement, [departmentId], (err) => {
                    if (err) throw err;
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    console.log(chalk.redBright(`Department Successfully Removed`));
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    viewAllDepartments();
                })
            })
    })
}
//Delete a Role method
const removeRole = () => {
    let sqlStatement = "SELECT role_tbl.id, role_tbl.title FROM role_tbl";

    //Connect to mysql
    connection.query(sqlStatement, (err, response) => {
        if (err) throw err;
        //Array to hold all roles
        let rolesArray = [];
        //For each role return from the sql statement push the name of it to the roles array
        response.forEach((role) => { rolesArray.push(role.title); });

        //Remove role prompt
        const removeRolePrompt = [
            {
                name: 'chosenRole',
                type: 'list',
                message: 'Which role would you like to remove?',
                choices: rolesArray
            }
        ]
        //Prompt user
        inquirer.prompt(removeRolePrompt)
            .then((answer) => {
                let roleId;

                //For each role returned from sql statement
                response.forEach((role) => {
                    //Check to find a match of the role chosen and grab the id
                    if (answer.chosenRole === role.title) {
                        roleId = role.id;
                    }
                });
                //Delete stamenet holds 1 parameter
                let sqlStatement = `DELETE FROM role_tbl WHERE role_tbl.id = ?`;
                //Connect to sql pass in chosen role id to delete statament parameter
                connection.query(sqlStatement, [roleId], (err) => {
                    if (err) throw err;
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    console.log(chalk.greenBright(`Role Successfully Removed`));
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    viewRoles();
                });
            });
    });
};




