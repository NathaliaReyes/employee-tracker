const inquirer = require('inquirer');
// const { join } = require('path');
// const { writeFile } = require('fs/promises');

const questions = [
  'What would you like to do?',
  'What is the name of the department?',
  'What would you like to do?',
  'What is the name of the role?',
  'What is the salary of the role?',
  'Which department does the role belong to?',
  ''
];

// class CLI {
//   constructor() {
//     this.options = [];
//   }

//   run() {
//     return inquirer
//       .prompt([
//         {
//           type: 'list',
//           message: questions[0],
//           choices: ['Viell All Employees', 'Add Employee', 'square'],
//           validate: function(response) {
//               if (response.length > 3 || response.length < 1) {
//                   return console.log('Please enter a valid response (maximum 3 characteres).');
//               } 
//               return true;
//           }
//         },
//         {
//           type: 'input',
//           message: questions[1],
//           name: 'textColor',
//           validate: function(response) {
//             if(response < 1 || (!response.includes('#') && response.includes(' '))) {
//               return console.log('Please enter a keyword Color or a hexadecimal color reference.');
//             }
//             return true;
//           }
//         },
//         {   
//           type: 'list',
//           message: questions[2],
//           choices: ['circle', 'triangle', 'square'],        
//           name: 'shape'
//         },
//         {
//           type: 'input',
//           message: questions[3],
//           name: 'shapeColor',
//           validate: function(response) {
//             if (response.length < 1 || (!response.includes('#') && response.includes(' '))) {
//               return console.log('Please enter a keyword Color or a hexadecimal color reference.');
//             }
//             return true;
//           }
//         },
//         {
//           type: 'list',
//           message: questions[4],
//           choices: ['yes', 'no'],
//           name: 'border',
//         },
//         {
//           type: 'input',
//           message: questions[5],
//           name: 'borderColor',
//           when: function(answers) {
//             return answers.border === 'yes';
//           },
//           validate: function(response) {
//             if (response.length < 1 || (!response.includes('#') && response.includes(' '))) {
//               return console.log('Please enter a keyword Color or a hexadecimal color reference.');
//             }
//             if(response === 'white' || response === '#ffffff' || response === '#fff'){
//               return console.log(' White border is not recommended. Please choose another color.');
//             }
//             return true;
//           }
//         }
//       ])
//       .then((data) => {
//         this.options = data;
//         this.options.text = this.options.text.toUpperCase();
//         let logoCreated;
//         switch (data.shape) {
//           case 'circle':
//             logoCreated = new circle(data.text, data.textColor, data.shapeColor, data.borderColor);
//             break;
//           case 'triangle':
//             logoCreated = new triangle(data.text, data.textColor, data.shapeColor, data.borderColor);
//             break;
//           case 'square':
//             logoCreated = new square(data.text, data.textColor, data.shapeColor, data.borderColor);
//             break;
//           default:
//             break;
//         }
//         const logo = logoCreated.render();
//         return logo;
        
//       })
//       .then((logo) => {
//         return writeFile(
//           join(__dirname, '..', 'examples', 'logo.svg'),
//           logo
//         );
//       })
//       .then(() => console.log('Generated logo.svg'))
//       .catch((err) => {
//         console.log(err);
//         console.log('Oops. Something went wrong.');
//       });
//   }
// }



module.exports = CLI;