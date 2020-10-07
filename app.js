const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
// declared to hold each employee object
const employeeArr = [];

function askUser() {
    inquirer
        // ask User for input
        .prompt([
            {
                type: "input",
                message: "What the employee's name?",
                name: "name"
            },
            {
                type: "input",
                message: "What the employee's Employee ID?",
                name: "id"
            },
            {
                type: "input",
                message: "What the employee's Email Address?",
                name: "email"
            },
            {
                type: "list",
                message: "what is the employee's role?",
                name: "role",
                choices: ["Manager", "Engineer", "Intern"]
            },
            {
                type: "input",
                message: "What is the manager's office number?",
                name: "officeNumber",
                when: function (response) {
                    return response.role === "Manager";
                }
            },
            {
                type: "input",
                message: "What is the engineers's Github username?",
                name: "github",
                when: function (response) {
                    return response.role === "Engineer";
                }
            },
            {
                type: "input",
                message: "What is the intern's school?",
                name: "school",
                when: function (response) {
                    return response.role === "Intern";
                }
            },
            {
                type: "confirm",
                message: "Would you like to add another Employee?",
                name: "anotheremployee",
            },
        ])
        .then(function (response) {

            // build new objects based on responses and push them into employeeArr
            switch (response.role) {
                case 'Manager':

                    const manager = new Manager(response.name, response.id, response.email, response.officeNumber);
                    employeeArr.push(manager);
                    break;

                case 'Engineer':

                    const engineer = new Engineer(response.name, response.id, response.email, response.github);
                    employeeArr.push(engineer);
                    break;
                case 'Intern':

                    const intern = new Intern(response.name, response.id, response.email, response.school);
                    employeeArr.push(intern);
                    break;
                default:
                    console.log(`Sorry something went wrong`);
            }
            // check if user wants to enter more employees
            if (response.anotheremployee === true) {
                // rerun questions if they do
                askUser();
            } else {
                // write the html file to the output file once all employees have been entered
                const html = render(employeeArr);
                fs.writeFile(outputPath, html, (err) => {
                    if (err) throw err;
                    console.log("Finished!");
                })

            }


        });
}

askUser();
