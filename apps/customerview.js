var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  listProducts();
});

//display all of the items available for sale in a table
var listProducts = function () {
  console.log("List of All Products");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.table(res);
    startPurchase(res);
  })
}

//prompt the user with two messages
//pick an ID of the product they want to buy
//how many units of the product they want to buy

var startPurchase = function (res) {

  inquirer.prompt([{
    type: "input",
    name: "choice",
    message: "What is the ID of the Item you would like to purchase? [Quit with q]"
    
  }]).then(function (answer) {
    var validProduct = false;
    if (answer.choice === "Q") {
      process.exit();
    }
    for (i = 0; i < res.length; i++) {
      if (res[i].item_id == answer.choice) {
        console.log(res[i].stock_total, res[i].product_name, " found!")
        validProduct = true;
        var item = answer.choice; 
        // console.table(item[i]);
        var id = i;
        // console.table(id);
        // console.table(item);

        inquirer.prompt({
          type: "input",
          name: "quantity",
          message: "How many would you like to purchase?",
          validate: function (value) {
            if (isNaN(value) == false) {
              return true;
            }else{
            return false;
          }}
        })
          .then(function (answer) {
            if ((res[id].stock_total - answer.quantity) > 0) {
              connection.query("UPDATE products SET stock_total = ?'", (res[id].stock_total - answer.quantity)+ " 'WHERE product_name = ?'" + item + "'", function (err, res2) {
                console.log("Purchase made!");
                console.log("Your total is ", res[id].price * answer.quantity);
                
               listProducts();
                
              })
            } else {
              console.log("Not a Valid Product.")
              listProducts();
            }
          })

      }
    }
    // if (i == res.length && validProduct == false) {
    //   console.log("Not a Valid Product");
    //   startPurchase(res);
    // }
  })
}




