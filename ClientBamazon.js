//Require npm packages that will be used 
var inquirer = require('inquirer');
var mysql = require('mysql');

//Declaring a variable which will store our connection 
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	//User name
	user: 'root',

	//Default password "root"
	password: 'root', //your password
	database: 'BamazonDB'
});
connection.connect(function (err) {
	if (err) throw err;
	console.log("Connected as id " + connection.threadId);
	shoppingNow();

});
// User Input Validation
function intOnly(value) {
	var int = Number.isInteger(parseFloat(value));
	var plusNotMinus = Math.sign(value);

	if (int && (plusNotMinus === 1)) {
		return true;

	} else {
		return "Please enter positive, whole and non-zero numero!"
	}
}; //bottom

//Function Prompt
function clientRequest() {
	inquirer.prompt([{
			type: 'input',
			name: 'item_id',
			message: '~Each product has an Item ID, Please enter the number corresponding to your product.',
			validate: intOnly,
			filter: Number

		},
		{
			type: 'input',
			name: 'quantity',
			message: '~It will be nice to know the quantity ?',
			validate: intOnly,
			filter: Number
		}
	]).then(function (input) {

		var item = input.item_id;
		var quantity = input.quantity;

		//Check stock availability 
		var stckAvlblity = 'SELECT * FROM products WHERE ?';

		connection.query(stckAvlblity, {
			item_id: item
		}, function (err, data) {

			if (err) throw err;

			if (data.length === 0) {
				console.log("Error! Please enter a valid product ID");
				showInventory();

			} else {
				var productInfo = data[0];

				//If the product is available check
				if (quantity <= productInfo.stock_quantity) {
					console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
					console.log("~~~~Great news, we have what you need, in stock!~~~~")
					console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
					console.log(productInfo);

					var updateStckAvlblity = "UPDATE products SET stock_quantity =" + (productInfo.stock_quantity - quantity) + ' WHERE item_id =' + item;

					connection.query(updateStckAvlblity, function (err, data) {
						if (err) throw err;
						console.log("~~Your order was successfully placed! Total to be paid $" + productInfo.price * quantity + " ~~~~");
						console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
						console.log("~~~~Thank you for your business!~~~~");
						console.log("\n|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|\n");
					})
				} else {
					console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
					console.log("~~~Unfortunately this product is Out Of Stock~~~");
					console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
					console.log("~~~Please try something else, we have a variety of goods you might sub it~~~");
					console.log("\n|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Thank~~You~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|\n");

					showInventory();
					noMo();
				}
			}
		})
	})
}; //bottom

//Function showcase
function showInventory() {
	stckAvlblity = "SELECT * FROM products";
	connection.query(stckAvlblity, function (err, data) {
		if (err) throw err;

		//Check log to console
		console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
		console.log("Products in stock: ");
		console.log("\n~~~~~~~~~~~~~~~~~~~~~~Inventory~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
		//Our stock loop 
		var stk = "";
		for (var i = 0; i < data.length; i++) {
			stk = "";
			stk += "Product Id: " + data[i].item_id + "||>";
			stk += "Product Name: " + data[i].product_name + "||>";
			stk += "Department : " + data[i].department_name + "||>";
			stk += "Product price $ " + data[i].price + "\n>";

			//Check logging to console
			console.log(stk);
		}
		console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
		clientRequest();
	})
} //bottom

//Go shopping now. Start will be invoked at the top connection function
function shoppingNow() {
	showInventory();
} //bottom

function noMo() {
	connection.end();
	console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
	console.log('Have a great day!')
	console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
}
