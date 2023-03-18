USE business_manager;

INSERT INTO departments (name)
VALUES ('Sales'),
       ('Marketing'),
       ('Human Resources'),
       ('Finance'),
       ('IT');

INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Manager', 75000, 1),
       ('Sales Associate', 45000, 1),
       ('Marketing Manager', 80000, 2),
       ('Marketing Specialist', 52000, 2),
       ('HR Manager', 68000, 3),
       ('HR Assistant', 42000, 3),
       ('Finance Manager', 85000, 4),
       ('Accountant', 50000, 4),
       ('IT Manager', 90000, 5),
       ('Software Developer', 70000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Jane', 'Smith', 2, 1),
       ('Alice', 'Johnson', 3, NULL),
       ('Bob', 'Brown', 4, 3),
       ('Charlie', 'Davis', 5, NULL),
       ('Eve', 'Taylor', 6, 5),
       ('David', 'Garcia', 7, NULL),
       ('Sophia', 'Martin', 8, 7),
       ('Lucas', 'Jackson', 9, NULL),
       ('Emma', 'Lee', 10, 9);
