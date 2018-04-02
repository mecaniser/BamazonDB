-- Will recreate the DB even if DB exist already
DROP DATABASE IF EXISTS BamazonDB;
-- Next line will creat the database BamazonDB
CREATE DATABASE BamazonDB;
-- Command to use the Database that was just created
USE BamazonDB;


-- Next we will create a new table which will contain: products, departments, price and stock qntty 
CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(20) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER(11) NOT NULL,
	PRIMARY KEY (item_id)
);
-- Products table will be completed with a list of item.
INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES  
('Lenovo ideapad 320 ', 'Electronics', 229.00, 24),
('Logitech 16" Laptop Sleeve', 'Accessories', 11.50, 42),
('Worx WorxSAW ', 'Home Improvement', 57.00, 49),
('Zdatt Bendable Snow','Winter',12.99,100),
('Rubber Floor Mat','Automotive',19.99,100),
('Asus - ROG STRIX H270F','Computers',139.99,10),
('Samsung Washer with Steam','Home',999.99,7),
('Insignia™ - C Batteries','Garage & Office',8.99,100),
('Microsoft - Xbox One X 1TB','Video Games',499.99,10),
('Intel® - Core i7-7700K Quad-Core 4.2 GHz Desktop Processor','Computers',345.99,16),
('AMD Ryzen - 1700X Octa-Core 3.4 GHz Desktop Processor','Computer Components',339.99,7),
('Microsoft - Surface Pro – 12.3” – Intel Core i7','Tablets',2699.00,8);
