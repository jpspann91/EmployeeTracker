const connection = require('./config/connection');
const cTable = require('console.table');
const figlet = require('figlet');
const validator = require('./public/validate');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');



//Establish connection to Databaseand show Start Title
connection.connect((err) => {
    if (err) throw err;
    console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
    console.log("");
    console.log(chalk.greenBright.bold(figlet.textSync('Employee Tracker')));
    console.log(`                                                          ` + chalk.greenBright.bold('Built By: Joseph Spann'));
    console.log("");
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

const promptUser = () => {
    inquirer.prompt(titlePrompt)
        .then((userAnswers) => {
            const { choices } = userAnswers;
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
//View All Employees
const viewAllEmployees = () => {
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
    connection.query(sqlStatement, (err, response) => {
        if (err) throw err;
        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
        console.log(`                              ` + chalk.green.bold(`Current Employees:`));
        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
        console.table(response);
        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
        promptUser();
    })
}
//View All Roles
const viewRoles = () => {
    console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
    console.log(`                              ` + chalk.green.bold(`Current Employee Roles:`));
    console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
    const sqlStatement = `SELECT role_tbl.id, role_tbl.title, department_tbl.department_name AS department
                            FROM role_tbl
                            INNER JOIN department_tbl ON role_tbl.department_id = department_tbl.id`;
    connection.query(sqlStatement, (err, response) => {
        if (err) throw err;
        response.forEach((role) => { console.log(role.title); });
        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
        promptUser();
    })
}

const viewAllDepartments = () =>{
    const sqlStatement = `SELECT department_tbl.id AS id, department_tbl.department_name AS department FROM department_tbl`
    connection.query(sqlStatement, (err, response)=>{
        if (err) throw err;
        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
        console.log(`                              ` + chalk.green.bold(`All Departments:`));
        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
        console.table(response);
        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
        promptUser();
    })
}
//View All Departments
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
//View Department Budgets
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
//ADD SECTION HERE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Add New Employee
const addAnEmployee = () => {
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
    inquirer.prompt(namePrompt)
        .then((answer) => {
            const critArray = [answer.firstName, answer.lastName];
            const roleTblSql = `SELECT role_tbl.id, role_tbl.title FROM role_tbl`;
            connection.query(roleTblSql, (err, data) => {
                if (err) throw err;
                const roles = data.map(({ id, title }) => ({ name: title, value: id }));
                roles.push("Create New Role");
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "Enter in the employee's role",
                        choices: roles
                    }
                ]).then(roleChoice => {
                        const role = roleChoice.role;
                        if(role === 'Create New Role'){
                            addRole();
                            // console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                            // console.log(chalk.magenta.bold('To Continue Choose Add Employee Again'));
                        }else {
                            critArray.push(role);
                        const managerTblSql = `SELECT * FROM employee_tbl`;
                        connection.query(managerTblSql, (err, data) => {
                            if (err) throw err;
                            const managersArray = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                            managersArray.push('None');
                            const managerPrompt = [
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Enter in the employee's manager",
                                    choices: managersArray
                                }
                            ]
                            inquirer.prompt(managerPrompt)
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    if(manager === 'None'){
                                        const sqlStatement = `INSERT INTO employee_tbl (first_name, last_name, role_id)
                                                                VALUES(?, ?, ?)`;
                                        connection.query(sqlStatement, critArray, (err) => {
                                            if (err) throw err;
                                            console.log('This Employee Has Been Added!');
                                            viewAllEmployees();
                                        })
                                    }else{
                                        critArray.push(manager);
                                        const sqlStatement = `INSERT INTO employee_tbl (first_name, last_name, role_id, manager_id)
                                                                VALUES(?, ?, ?, ?)`;
                                        connection.query(sqlStatement, critArray, (err) => {
                                            if (err) throw err;
                                            console.log('This Employee Has Been Added!');
                                            viewAllEmployees();
                                        });}
                                    
                                });
                        });
                        }
                        
                    });
            });
        });
};
//Add new Role
const addRole = () => {
    const sqlStatement = 'SELECT * FROM department_tbl'
    connection.query(sqlStatement, (err, response) => {
        if (err) throw err;
        let deptNameArray = [];
        response.forEach((department) => {deptNameArray.push(department.department_name);});
        deptNameArray.push('Create New Department');
        inquirer.prompt([
            {
              name: 'departmentName',
              type: 'list',
              message: 'Which department is this new role in?',
              choices: deptNameArray
            }
          ])
          .then((answer) => {
            if (answer.departmentName === 'Create New Department') {
              addDepartment();
              console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
              console.log(chalk.magenta.bold('To Continue Choose Add Employee Again On Next Prompt'));
            } else {
              addRoleResume(answer);
            }
          });
  
        const addRoleResume = (departmentData) => {
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
              let createdRole = answer.newRole;
              let departmentId;
  
              response.forEach((department) => {
                if (departmentData.departmentName === department.department_name) {
                    departmentId = department.id;}
              });
  
              let sqlStatement2 =   `INSERT INTO role_tbl (title, salary, department_id) VALUES (?, ?, ?)`;
              let critArray = [createdRole, answer.salary, departmentId];
  
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

    inquirer.prompt(addDeptPrompt)
        .then((answer) => {
            let sqlStatement = `INSERT INTO department_tbl (department_name) VALUES(?)`;
            connection.query(sqlStatement, answer.newDepartment, (err, response)=>{
                if (err) throw err;
                console.log("");
                console.log(chalk.greenBright(answer.newDepartment + ` Department successfully created!`));
                console.log("");
                viewAllDepartments();
            });
        });
};

//UPDATE SECTION STARTS HERE~~~~~~~~~~~~~~~~~~~~~~~~~~~
const updateEmployeeRole = () =>{
    let sqlStatement = `SELECT employee_tbl.id, employee_tbl.first_name, employee_tbl.last_name, role_tbl.id AS 'role_id' 
    FROM employee_tbl, role_tbl, department_tbl WHERE department_tbl.id = role_tbl.department_id AND role_tbl.id = employee_tbl.role_id`;

    connection.query(sqlStatement, (err, res) =>{
        if (err) throw err;
        let employeeNameArray = [];

        res.forEach((employee) =>{employeeNameArray.push(`${employee.first_name} ${employee.last_name}`);});
        let sqlRoleTbl = `SELECT role_tbl.id, role_tbl.title FROM role_tbl`;
        connection.query(sqlRoleTbl,(err,response)=>{
            if (err) throw err;
            let roleArray = [];

            response.forEach((role) => {roleArray.push(role.title);});
            roleArray.push('Create New Role');

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

            inquirer.prompt(updateRolePrompt)
                .then((answer)=>{
                    let newTitleId, employeeId;

                    if(answer.chosenRole === 'Create New Role'){
                        addRole();
                        console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                        console.log(chalk.magenta.bold('To Continue Choose Add Employee Again On Next Prompt'));
                        response.forEach((role) =>{
                            if(answer.chosenRole.trim() === role.title.trim()){
                                newTitleId = role.id;
                                
                                }
                            });
                            res.forEach((employee)=>{
                                
                                const fullName = `${employee.first_name} ${employee.last_name}`
                                if(answer.chosenEmployee.trimEnd() === fullName.trimEnd()){
                                    employeeId = employee.id;
                                    
                                    console.log(employeeId);
                                    }
                            
                            });
                            let sqlUpdate = `UPDATE employee_tbl SET employee_tbl.role_id = ? WHERE employee_tbl.id = ?`;
                            connection.query(sqlUpdate, [newTitleId, employeeId], (err) =>{
                                if(err) throw err;
                                console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                                console.log(chalk.greenBright(`Employee Role Updated`));
                                console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                                viewAllEmployees();
                            })
                    }
                    else{
                        response.forEach((role) =>{
                        if(answer.chosenRole.trim() === role.title.trim()){
                            newTitleId = role.id;
                            
                            }
                        });
                        res.forEach((employee)=>{
                            
                            const fullName = `${employee.first_name} ${employee.last_name}`
                            if(answer.chosenEmployee.trimEnd() === fullName.trimEnd()){
                                employeeId = employee.id;
                                
                                console.log(employeeId);
                                }
                        
                        });
                        let sqlUpdate = `UPDATE employee_tbl SET employee_tbl.role_id = ? WHERE employee_tbl.id = ?`;
                        connection.query(sqlUpdate, [newTitleId, employeeId], (err) =>{
                            if(err) throw err;
                            console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                            console.log(chalk.greenBright(`Employee Role Updated`));
                            console.log(chalk.yellow.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                            viewAllEmployees();
                        }); 
                    }
                        
                             
            });
        });
    });
};
//Update Employee Manager
const updateEmployeeManager = () =>{
    let sqlStatement = `SELECT employee_tbl.id, employee_tbl.first_name, employee_tbl.last_name, employee_tbl.manager_id
                        FROM employee_tbl`;
     connection.query(sqlStatement, (err, response)=>{
         let employeeNameArray = [];
         response.forEach((employee) =>{employeeNameArray.push(`${employee.first_name} ${employee.last_name}`);});

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

         inquirer.prompt(updateManagerPrompt)
            .then((answer)=>{
                let employeeId, managerId;
                response.forEach((employee)=> {
                    if(answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`){
                        employeeId = employee.id;
                    }

                    if(answer.newManager === `${employee.first_name} ${employee.last_name}`){
                        managerId = employee.id;
                    }
                });

                if(validator.isEqual(answer.chosenEmployee, answer.newManager)){
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    console.log(chalk.redBright(`Invalid Manager Selection`));
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    promptUser();
                }else{
                    let sqlStatement = `UPDATE employee_tbl SET employee_tbl.manager_id = ? WHERE employee_tbl.id = ?`;

                    connection.query(sqlStatement, [managerId, employeeId], (err)=>{
                        if(err) throw err;
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
//Remove an employee
const removeAnEmployee = () =>{
    let sqlStatement = `SELECT employee_tbl.id, employee_tbl.first_name, employee_tbl.last_name FROM employee_tbl`;
    connection.query(sqlStatement,(err, response)=>{
        if (err) throw err;
        let employeeNameArray = []
        response.forEach((employee)=>{employeeNameArray.push(`${employee.first_name} ${employee.last_name}`);});

        const removeEmployeePrompt = [
            {
                name: 'chosenEmployee',
                type: 'list',
                message: 'Which employee would you like to remove?',
                choices: employeeNameArray
              }
        ]
        inquirer.prompt(removeEmployeePrompt)
            .then((answer) =>{
                let employeeId;

                response.forEach((employee) => {
                    if(answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`){
                        employeeId = employee.id;
                    }
                });

                let sqlStatement = "DELETE FROM employee_tbl WHERE employee_tbl.id = ?";

                connection.query(sqlStatement, [employeeId], (err)=>{
                    if (err) throw err;
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    console.log(chalk.redBright(`Employee Successfully Removed`));
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    viewAllEmployees();
                });
            });
    });
};
//Delete a Role
const removeRole = () => {
    let sqlStatement = "SELECT role_tbl.id, role_tbl.title FROM role_tbl";

    connection.query(sqlStatement, (err, response)=>{
        if (err) throw err;
        let rolesArray = [];
        response.forEach((role)=>{rolesArray.push(role.title);});

        const removeRolePrompt = [
            {
                name: 'chosenRole',
                type: 'list',
                message: 'Which role would you like to remove?',
                choices: rolesArray
            }
        ]

        inquirer.prompt(removeRolePrompt)
            .then((answer) =>{
                let roleId;

                response.forEach((role)=>{
                    if(answer.chosenRole === role.title){
                        roleId = role.id;
                    }
                });

                let sqlStatement = `DELETE FROM role_tbl WHERE role_tbl.id = ?`;
                connection.query(sqlStatement, [roleId], (err)=>{
                    if (err) throw err;
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    console.log(chalk.greenBright(`Role Successfully Removed`));
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    viewRoles();
                });
            });
    });
};
//Remove a Department
const removeDepartment = () =>{
    let sqlStatement = `SELECT department_tbl.id, department_tbl.department_name FROM department_tbl`;
    connection.query(sqlStatement, (err, response)=>{
        if (err) throw err;
        let departmentArray = [];
        response.forEach((department) =>{departmentArray.push(department.department_name);});

        const removeDeptPrompt = [
            {
                name: 'chosenDept',
                type: 'list',
                message: 'Which department would you like to remove?',
                choices: departmentArray
            }
        ];

        inquirer.prompt(removeDeptPrompt)
            .then((answer) =>{
                let departmentId;

                response.forEach((department) =>{
                    if(answer.chosenDept === department.department_name){
                        departmentId = department.id;
                    }
                });

                let sqlStatement = "DELETE FROM department_tbl WHERE department_tbl.id = ?";

                connection.query(sqlStatement, [departmentId], (err)=>{
                    if (err) throw err;
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    console.log(chalk.redBright(`Department Successfully Removed`));
                    console.log(chalk.redBright.bold(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`));
                    viewAllDepartments();
                })
            })
    })
}



