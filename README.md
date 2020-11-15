# emma-nodejs-challenge
This project is a key/value pair storage implemented in SQlite and Nodejs. 

It is more or less an imitation of the interactive tutorial found at: https://try.redis.io/

# Overview

1. I used a framework called [Sequelize](https://sequelize.org/),this framework will make the class modular, scalable and easy to extend to multiple databases. The DB used in this project is SQlite.

2. Persistance: The storage supports persistance for a limited time, so the user can set a limited time in seconds to persist the data in the DB, after the specified time interval, the record (key/value) will be deleted.

3. The 3 functions that can be called are set('my_key', x, y) where x and y are the value to be stored and the persistant time interval (in seconds) respectively, get('my_key') which returns null if there's no key and clean() for deleting all the records in the storage.

# Breaking down the code

1. Define the model: choose the dialect (in my case sqlite), and the path of the storage in storage:''.
2. Initialize the columns and the table; I used 3 columns: key column, value column and expiresOn column, the first 2 are self explanatory, the expiresOn column is used for data persistence which will be discussed later in detail.
3. set function: I used [upsert](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-upsert) to insert/update a single key/value pair; for data persistence, I used [moment](https://momentjs.com/) to get the current time, then, the time interval inputted by the user will be added to the current time.
4. get function: before retrieving a value for a key, this method checks for any expired data by comparing the current time with the expiresOn time wich was set by the set() function. Think of it as an SQL statement (DELETE * From Table Where 'expiresOn' < 'Current time'. This way, the code gurantees data persistance. 
5. Interaction with the user: I used [Inquirer](https://www.npmjs.com/package/inquirer) to let the user call the functions using the terminal.

# Running the code

1. Clone the repository into your PC and open the project. 
2. npm install to install all the libraries discussed above, found in package.json.
3. Write in the terminal node main.js (you should go to the directory of the project on your PC)
4. The inquirer will prompt a message: Please Enter your command 
5. Call the functions in the following formats: storage->set('k', x, y); || storage->get('k'); || storage->clean();

# Future Work

The validation of the inquirer intercation is naive, if the user inputs a wrong command or doesn't type the correct form, the program will throw an error. However, it doesn't cover all the test cases. 

The user should run the code (node main.js) before calling a function. Remember this only the Dev side of the project.
