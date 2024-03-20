# 💼 employee-tracker
This is the Challenge 12 related to SQL

[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Description
Employee-Tracker is a robust command-line application designed to streamline the management of a company's employee database. Built from the ground up, this application leverages the power of Node.js to provide a fast, efficient, and user-friendly interface.

At the heart of Employee-Tracker is Inquirer, a comprehensive collection of common interactive command-line user interfaces. Inquirer is used to generate a series of prompts, allowing users to easily navigate through the application and perform a variety of tasks such as adding, viewing, and updating employee records.

The application is backed by PostgreSQL, a powerful, open-source object-relational database system. PostgreSQL provides advanced features such as MVCC (multi-version concurrency control), point-in-time recovery, tablespaces, and more. This ensures that Employee-Tracker can handle complex queries and large databases with ease.

## Database-Appearance

Entity Relationship Diagram:
📍![ERD](/assets/tracker_db_ERD.pgerd.png)

The following walkthrough video demonstrates the appearance and functionality of the command-line application:
![APPEARANCE-APPLICATION]()

## Table of Contents
- [💼 employee-tracker](#-employee-tracker)
  - [Description](#description)
  - [Database-Appearance](#database-appearance)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Credits](#credits)
    - [📚Acknowledgements](#acknowledgements)
  - [License](#license)
  - [Features](#features)
  - [Contributing](#contributing)
  - [Tests](#tests)
  - [❔Questions](#questions)

## Installation

To install this application, you'll need Node.js and npm installed on your computer. Follow these steps:

1. Clone this repository to your local machine using `git clone <[repository-url](https://github.com/NathaliaReyes/employee-tracker.git)>`.
2. Navigate to the cloned repository in your terminal.
3. Install the necessary npm packages by running `npm install`.
4. Ensure you have a PostgreSQL server running and accessible.
5. Set up your database by running the provided schema file in your PostgreSQL client.
6. Update the `pool` configuration in the application code with your PostgreSQL server details.
7. Start the application by running `node <server.js>` in your terminal.

Please refer to the `Usage` section for more details on how to use the application.

## Usage

1. Start the application by running `node server.js` in your terminal.
2. You will be presented with a series of prompts and choices in your terminal. Navigate through them using the arrow keys and Enter to select.
3. Choose an action from the main menu. You can view, add, update, or delete employees, roles, and departments.
4. Depending on your choice, you may be asked to provide more information or make additional selections. For example, if you choose to add an employee, you will be asked to enter the employee's first name, last name, role, and manager.
5. The application will perform your requested action and then return you to the main menu. For example, if you choose to view all employees, a table of employees will be printed to your terminal.
6. To exit the application, choose "Quit" from the main menu.

This application is intended to provide a simple and efficient way to manage a company's employee database from the command line. It's an excellent tool for business owners, HR personnel, and managers who need to keep track of employee roles, departments, and managers.

## Credits

Some material and concepts used in this challenge were learned from the [University of Denver Bootcamp](https://bootcamp.du.edu/coding/).

[Toptal](https://www.toptal.com/developers/gitignore) Used to create .gitignore file.

[pgAdmin4](https://www.pgadmin.org/) is an open-source tool for PostgreSQL with a built-in ERD tool.

### 📚Acknowledgements

- **Node.js:** Environment for running JavaScript on the server-side.
- **pg-pool:** Provides pooling services for your PostgreSQL database connections.
- **Inquirer:** A collection of common interactive command-line user interfaces.

## License

Copyright (c) Silvia Reyes. All rights reserved.

+ Licensed under the [MIT License.](https://opensource.org/licenses/MIT) : Expat License.


## Features

+ **Employee Management:** Users can add, view, delete and update employees. This allows for full control over the employee database.

+ **Role Management:** Users can add, view, delete and update roles. This allows for easy management of employee roles and responsibilities.

+ **Department Management:** Users can efficiently organize different sectors within the company by adding, viewing, updating, and deleting departments. Additionally, they can view the budget by department for employees, providing better financial control and decision-making.

+ **Manager Assignment:** Users can assign managers to employees, providing a clear hierarchy and chain of command.

+ **Command Line Interface:** The application is run entirely through the command line, providing a simple and straightforward user experience.

+ **Data Validation:** The application includes data validation to ensure that all input is in the correct format and meets certain criteria.

+ **PostgreSQL Database:** The application uses a PostgreSQL database for data storage, providing robust, reliable, and efficient data management.

+ **Inquirer.js:** The application uses Inquirer.js to interact with the user via the command line, providing a series of prompts and choices to navigate through the application.

## Contributing

Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature`)
3. Commit your Changes (`git commit -m 'Add some feature'`)
4. Push to the Branch (`git push origin feature`)
5. Open a Pull Request

## Tests

n/a

## ❔Questions
If you have any questions, feedback, or suggestions, feel free to reach out! You can contact me through my GitHub profile or via email.

GitHub Profile 💻: [NathaliaReyes](https://github.com/NathaliaReyes)
Email 📧: silvianathaliareyes96@gmail.com
LinkedIn 👩🏻‍💻: [SilviaReyes](https://www.linkedin.com/in/silvia-reyes-2b907123b/)

I'm always open to discussions and eager to help. Don't hesitate to get in touch!



***Thanks for stopping!***