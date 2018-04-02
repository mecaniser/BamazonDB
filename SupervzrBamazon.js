//Require npm packages that will be used 
var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');

//Declaring a variable which will store our connection 
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	user: 'root',

	//Default password "root"
	password: 'root',
	database: 'BamazonDB'
});

//Executes connection and starts the main .js function
connection.connect(function (err) {
	if (err) throw err;
	console.log("Connected as id " + connection.threadId);
	supervisorActionPrompt();
});

function supervisorActionPrompt() {
	//Supervisor option menu
	inquirer.prompt([{
			type: 'list',
			name: 'selection',
			message: 'What would you like to do next ?',
			choices: ['| Display Products in stock', '| Add New Product', '| Display low Inventory', '| Update New Product', '| Delete Product', '| Exit'],
			filter: function (input) {
				switch (input) {
					case '| Display Products in stock':
						return 'stock';
					case '| Add New Product':
						return 'newItem';
					case '| Display low Inventory':
						return 'lowInvntry';
					case '| Update New Product':
						return 'addInvntry';
					case '| Delete Product':
						return 'deleteItem';
					case '| Exit':
						return 'noMo';
					default:
						console.log("This option in not available");
				}
			}
		}])
		.then(function (val) {

			switch (val.selection) {
				case 'stock':
					showInventory();
					break;
				case 'newItem':
					showNewProduct();
					break;
				case 'lowInvntry':
					showLowInvntry();
					break;
				case 'addInvntry':
					showAddInvntry();
					break;
				case 'deleteItem':
					removeRequest();
					break;
				case 'noMo':
					noMo();
					break;
			}
		})
}; //bottom

function showInventory() {
	stckAvlblity = "SELECT * FROM products";

	connection.query(stckAvlblity, function (err, data) {
		if (err) throw err;

		//Check log to console
		console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
		console.log("Products in stock: ");
		console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

		//Our stock loop 
		var stk = "";
		for (var i = 0; i < data.length; i++) {
			stk = "";
			stk += "Product Id: " + data[i].item_id + "||>";
			stk += "Product Name: " + data[i].product_name + "||>";
			stk += "Department: " + data[i].department_name + "||>";
			stk += "Product price $ " + data[i].price + "||>";
			stk += "Quantity: " + data[i].stock_quantity + '\n';

			//Check logging to console
			console.log(stk);
		}
		supervisorActionPrompt();
	})
	console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
}; //bottom

function showLowInvntry() {

	stckAvlblity = 'SELECT * FROM products WHERE stock_quantity < 15';

	connection.query(stckAvlblity, function (err, res) {
		if (err) throw err;
		console.log('');
		console.log('|~~~~~~~ Will be shown all products with stock lower then 15 items ~~~~~~~~~|');
		console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");


		var stk = "";
		for (var i = 0; i < res.length; i++) {
			stk = "";
			stk += "Product Id: " + res[i].item_id + " ||>";
			stk += "Product Name: " + res[i].product_name + " ||>";
			stk += "Department : " + res[i].department_name + " ||>";
			stk += "Product price $ " + res[i].price + "\n>";
			stk += "In Stock " + res[i].stock_quantity + "\n>";
			console.log(stk);
		}
		supervisorActionPrompt();

	})
	console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

}; //bottom

function showAddInvntry() {
	inquirer.prompt([{
			type: 'input',
			name: 'item_id',
			message: '~ What Item would you like to update? (enter item Id)',
			validate: intOnly,
			filter: Number

		},
		{
			type: 'input',
			name: 'quantity',
			message: '~ It will be nice to know new quantity to add?',
			validate: intOnly,
			filter: Number
		}
	]).then(function (input) {

		var item = input.item_id;
		var newQuantity = input.quantity;

		//Check stock availability 
		var stckAvlblity = 'SELECT * FROM products WHERE ?';

		connection.query(stckAvlblity, {
			item_id: item
		}, function (err, data) {

			if (err) throw err;
			console.log("[mysql error]", err);

			if (data.length === 0) {
				console.log("Error! Please enter a valid product ID");
				showAddInvntry();

			} else {
				var productInfo = data[0];
				console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
				console.log('New product  will be added to the Inventory');
				console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

				//If the product is available check


				var updateStckAvlblity = "UPDATE products SET stock_quantity= " + (productInfo.stock_quantity + newQuantity) + ' WHERE item_id=' + item;
				console.log('Your changes:')

				connection.query(updateStckAvlblity, function (err, data) {
					if (err) throw err;
					console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
					console.log('Previous Quantity (' + productInfo.stock_quantity + ') Id Number: ' + item + ' updated to ' + (productInfo.stock_quantity + newQuantity) + ' |');
					console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

					supervisorActionPrompt(); //Calls back the selection menu

				})
			}
		})
	})
	console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

}; //bottom

function showNewProduct() {
	inquirer.prompt([{
		type: 'input',
		name: 'product_name',
		message: 'What would you like to add? (product name)'
	}, {
		type: 'input',
		name: 'department_name',
		message: 'What category/department will this product go to ?'
	}, {
		type: 'input',
		name: 'price',
		message: 'What is the value of the new position (unit price) ?',
		validate: intOnly
		// digitalValidation
	}, {
		type: 'input',
		name: 'stock_quantity',
		message: 'How many new positions will be added (qnty number)?',
		validate: intOnly
	}]).then(function (input) {

		var stckAvlblity = 'INSERT INTO products SET ?';

		//New Item will be inserted here
		connection.query(stckAvlblity, input, function (err, result, ) {
			if (err) throw err;
			console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
			console.log('New position was added to the product list, Id number: ' + result.insertId + '.')
			console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

			supervisorActionPrompt();
		})
	}) //~~~>
}; //bottom

function removeRequest() {
	inquirer.prompt([{
		name: "iDelete",
		type: "input",
		message: "What position would you like to Delete? (product ID)"
	}]).then(function (res) {
		var iDel = res.iDelete;
		removeFromDatabase(iDel);
	})

}; //end removeRequest


function removeFromDatabase(iDel) {
	connection.query('DELETE FROM products WHERE item_id= ' + iDel);
	console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
	console.log('Product with number id = ' + iDel + " was deleted");
	console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");


	supervisorActionPrompt();
};
// } //bottom
function digitalValidation(number) {
	var digit = Number.isInteger(parseFloat(number));
	var nonNegative = parseFloat(number) > 0;
	console.log(digit);
	console.log(nonNegative)
	if (digit && nonNegative) {
		return true;
	} else {
		return 'Your selection should be \nnon-negative \nwhole number \nnon-zero \nin order to change the item price';
	}

}; //bottom

function intOnly(value) {
	var int = Number.isInteger(parseFloat(value));
	var plusNotMinus = Math.sign(value);

	if (int && (plusNotMinus === 1)) {
		return true;

	} else {
		console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
		return "Please enter positive, whole and non-zero numero!"
		console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
	}
}; //bottom

function noMo() {
	connection.end();
	console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
	console.log('Have a great day!')
	console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

}