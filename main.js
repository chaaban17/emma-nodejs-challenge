
const Sequelize = require('sequelize');
const inquirer = require('inquirer')
const Op = Sequelize.Op;
const moment = require('moment');

//defining the storage and the dialect
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  pool: {
    max: 500,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  storage: './database.sqlite'
});

//initializing our store
  const Store = sequelize.define('store', {
    key: {
      type: Sequelize.STRING
    },
    value: {
      type: Sequelize.STRING
    },
    expiresOn:{
      type: Sequelize.STRING
    },
  });

  
  //method to create a table in the DB
  
  //force: true will drop the table if it already exists
  // Store.sync().then(() => {
  //   // Table created
  //   return Store.create({
  //     key:'B',
  //     value:'2',
  //   });
  // });

  
  //Getter, Setter and clean methods
  get = function(key) {
    let now = moment().format("LTS").toString();
    
    Store.destroy({
      where: {expiresOn: {
        [Op.lt]: now
    }
        
      }
  }).then(function(){
    Store.findAll({
      where: {
        key: key
      }
    }).then(function(results){
      var queryResult;
      results.forEach(function(result){
        if (result.dataValues.value) {
          queryResult = result.dataValues.value;
        }
      });
      if (queryResult) {
        console.log(queryResult)
      } else {
        console.log(null)
      }
    });
  })
    
  }

 
  set = function(key, value,expires) {
    expiresStr = moment().add(expires, "seconds").format("LTS").toString();
    
    Store.upsert({ key: key, value: value, expiresOn:expiresStr}).then(function(){
        console.log("OK")
    }).catch(function(err){
      console.log(err)
    });
    
  }

  clean = function() {
    Store.destroy({
      truncate: true,
  })
  }

  //defining the structure of the terminal input
  PREFIX = "storage->"
  SUFFIX = ");"
  var command = [
    {
      type: 'input',
      name: 'operation', 
      message: "Please Enter your command"
    }
  ]
  
  //prompting the inquirer for terminal interaction
  inquirer.prompt(command).then(answers => {
    var input = answers.operation

    if(input.toLowerCase().startsWith(PREFIX) && input.toLowerCase().endsWith(SUFFIX)){
      if(input.includes("get") ){
        var getStr = input.match(/\((.*)\)/)[1]

        get(getStr)
        
      } else if(input.includes("set")) {
        var setStr = input.match(/\((.*)\)/)[1].split(",")
        str1 = setStr[0].replace(/ /g, '')
        str2 = setStr[1].replace(/ /g, '')
        str3 = setStr[2].replace(/ /g, '')
        
        set(str1,str2,str3)

      } else if(input.includes("clean")) {
        clean()
      } 
      else {
        console.log("The only available commands are get, set or clean")
  
      }
    } else {
      console.log("Invalid syntax")
    }
  
  })

  
  
