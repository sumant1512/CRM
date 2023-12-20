create database expenses_managment;
use expenses_managment;

CREATE TABLE User_Role(
    id int AUTO_INCREMENT,
    role_name varchar(100) NOT NULL,
    created_at datetime NOT NULL,
    modified_at datetime NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE User(
    id int AUTO_INCREMENT,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    mobile_number varchar(100) NOT NULL,
    is_active boolean ,
    role_id int,
    created_at datetime,
    modified_at datetime,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES User_Role(id)
);



CREATE TABLE Expense_Category(
    id int AUTO_INCREMENT,
    category_name varchar(50) NOT NULL,
    created_at datetime NOT NULL,
    modified_at datetime NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Expenses (
    id int AUTO_INCREMENT,
    category_id int,
    user_id int,
    expense_amount int,
    description varchar(100) NOT NULL,
    archived boolean,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (category_id) REFERENCES Expense_Category(id)
);


CREATE TABLE wallet(
    id int AUTO_INCREMENT,
    user_id int,
    amount int,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES User(id)
);

