INSERT INTO department(department_name)
VALUES("Engineering"), ("Sales"), ("Finance"), ("Legal"), ("Marketing");

INSERT INTO role(title, salary, department_id)
VALUES("Senior Developer", 125000, 1), ("Sales Rep", 75000, 2), ("CFO", 350000, 3), ("Junior Developer", 95000,1 ), ("SEO Specialist", 90000,5 ), ("Lawyer", 175000,4 );

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('James', 'Rando', 1, null), ('Erica', 'Sims', 2, 2), ('Ronald', 'Brady', 3, null), ('John', 'Jones', 4, 2), ('Lisa', 'Legal', 5, null);