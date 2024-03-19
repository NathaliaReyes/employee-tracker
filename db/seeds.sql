INSERT INTO departments(nombre)
VALUES
    ('Software Development'),
    ('Network Engineering'),
    ('Cybersecurity'),
    ('Database Administration'),
    ('System Administration'),
    ('IT Support');


INSERT INTO roles(title, salary, department)
VALUES
    ('Software Engineer', 80000.99, 1),
    ('Senior Software Engineer', 92000.99, 1),
    ('Wireless Communication Specialist', 75000.00, 2),
    ('Cybersecurity Analyst', 90000.00, 3),
    ('Help Desk Technician', 50000.00, 6),
    ('Desktop Support Engineer', 65000.00, 6),
    ('Web Developer', 75000.00, 4),
    ('Frontend Developer', 80000.00, 4),
    ('Backend Developer', 85000.00, 5),
    ('Full Stack Developer', 90000.00, 5);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, 2),
    ('Jane', 'Smith', 2, 1),
    ('Michael', 'Johnson', 3, 4),
    ('Emily', 'Williams', 4, 3),
    ('David', 'Brown', 5, 6),
    ('Sarah', 'Jones', 6, 5),
    ('Christopher', 'Miller', 7, 8),
    ('Amanda', 'Wilson', 8, 7),
    ('Daniel', 'Davis', 9, 10),
    ('Jessica', 'Martinez', 10, 9);