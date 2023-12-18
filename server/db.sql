create database shop_now;
use shop_now;

CREATE TABLE Customer (
    id int AUTO_INCREMENT,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Address (
    id int AUTO_INCREMENT,
    address_1 varchar(100) NOT NULL,
    address_2 varchar(100) NOT NULL,
    city varchar(100) NOT NULL,
    state varchar(100) NOT NULL,
    pincode varchar(100) NOT NULL,
    country varchar(100) NOT NULL,
    customer_id int,
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES Customer(id)
);

CREATE TABLE Shipment (
    id int AUTO_INCREMENT,
    shipment_date datetime NOT NULL,
    shipment_address_id int NOT NULL,
    customer_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (shipment_address_id) REFERENCES Address(id),
    FOREIGN KEY (customer_id) REFERENCES Customer(id)
);

CREATE TABLE PaymentMethod (
    id int AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE PaymentTransactions (
    id int AUTO_INCREMENT,
    payment_date varchar(100) NOT NULL,
    amount varchar(100) NOT NULL,
    customer_id int,
    payment_method_id int,
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES Customer(id),
    FOREIGN KEY (payment_method_id) REFERENCES PaymentMethod(id)
);

CREATE TABLE Category (
    id int AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Product (
    id int AUTO_INCREMENT,
    sku varchar(100) NOT NULL,
    description varchar(100) NOT NULL,
    price decimal(10.2) NOT NULL,
    stock int NOT NULL,
    category_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (category_id) REFERENCES Category(id)
);

CREATE TABLE Cart (
    id int auto_increment,
    quantity int,
    customer_id int,
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES Customer(id)
);

CREATE TABLE CartItems (
    id int auto_increment,
    cart_id int,
    product_id int,
    PRIMARY KEY (id),
    FOREIGN KEY (cart_id) REFERENCES Cart(id),
    FOREIGN KEY (product_id) REFERENCES Product(id)
);

CREATE TABLE Wishlist (
    id int auto_increment,
    quantity int,
    customer_id int,
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES Customer(id)
);

CREATE TABLE WishlistItems (
    id int auto_increment,
    wishlist_id int,
    product_id int,
    PRIMARY KEY (id),
    FOREIGN KEY (wishlist_id) REFERENCES Wishlist(id),
    FOREIGN KEY (product_id) REFERENCES Product(id)
);

CREATE TABLE Orders (
    id int auto_increment,
    order_date datetime not null,
    total_price decimal(10.2) not null,
    customer_id int not null,
    shipment_id int not null,
    payment_transaction_id int not null,
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES Customer(id),
    FOREIGN KEY (shipment_id) REFERENCES Shipment(id),
    FOREIGN KEY (payment_transaction_id) REFERENCES PaymentTransactions(id)
);

CREATE TABLE OrdersItems (
    id int auto_increment,
    quantity int NOT NULL,
    price decimal(10.2) not null,
    product_id int,
    order_id int,
    PRIMARY KEY (id),
    FOREIGN KEY (product_id) REFERENCES Product(id),
    FOREIGN KEY (order_id) REFERENCES Orders(id)
);


