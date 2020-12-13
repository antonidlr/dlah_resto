CREATE DATABASE dbdelilah;

USE dbdelilah;

-- TABLE USER

CREATE TABLE users (
    id INT(11) NOT NULL,
    username VARCHAR (60) NOT NULL,
    fullname VARCHAR (100) NOT NULL,
    email VARCHAR (255) NOT NULL UNIQUE,
    phone VARCHAR (25) NOT NULL,
    address VARCHAR(100),
    password VARCHAR(60),
    role tinyint NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT;

INSERT INTO users (id, username, fullname, email, phone, address, password, role)
    VALUES (1, 'admin', 'Antonio de los Rios', 'antoniodelosrios22@gmail.com', '1338048656', 'Cabildo 1500, Capital', 'admin', 1);

-- TABLE STATUS
/*
CREATE TABLE status (
    id INT(11) NOT NULL,
    status VARCHAR(25) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE status
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT;
*/

--TABLE PRODUCTS

CREATE TABLE products (
    id INT(11) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    list_price DECIMAL (10, 2) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (id, product_name, list_price)
    VALUES (1, 'Bagel de salmon', 425)


INSERT INTO products (product_name, list_price) VALUES
('Hamburguesa clásica', 350),
('Sandwich Veggie', 310),
('Ensalada Veggie', 340),
('Foccacia', 300),
('Sandwich Foccacia', 440),
('Ensalada Foccacia', 450)



--TABLE ORDERS

CREATE TABLE orders (
    order_id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT,
    status tinyint NOT NULL,
    total_price DECIMAL (10, 2) NOT NULL,
    payment tinyint NOT NULL,
    order_date DATETIME NOT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- status: 1 = new; 2 = confirmed; 3 = preparing; 4 = out_of_delivery 5 = ccanceled 6 = delivered
--payment: 1 = Cash 2 = Credit Card

-- TABLE Order Items
CREATE TABLE order_items (
    id INT(11) NOT NULL,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (order_id)
    REFERENCES orders (order_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id)
    REFERENCES products (id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

