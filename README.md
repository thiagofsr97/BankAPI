# Bank (API)

Bank Service API.



## Table of Contents

- **[Getting Started](#getting-started)**
  - [System Requirements](#system-requirements)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
- **[Making Requests](#making-requests)**
    - [User Requests](#user-requests)
        - [Register](#register)
        - [Login](#login)
        - [Consult All Users](#consult-all-users)
        - [Consult User by ID](#consult-user-by-id)
        - [Consult user wallet](#consult-user-wallet)
    - [Transaction Requests](#transaction-requests)
        - [Make Transaction](#make-transaction)
        - [Consult All Transactions](#consult-all-transactions)
        - [Consult User Transactions](#consult-user-transactions)


- **[Contributors](#contributors)**

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### System Requirements

* OS: Ubuntu 14 or higher | Windows 
* Processor: -  
* Memory: -   
* Storage: -

### Prerequisites

Before starting the installation, you need to install some prerequisites:

[Node.js](https://nodejs.org/en/)

```sh
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
```

```sh
sudo apt install -y nodejs
```
<br/>

[MongoDB](https://www.mongodb.com/)

```sh
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
```

```sh
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
```

```sh
sudo apt update
```

```sh
sudo apt install -y mongodb-org
```
<br/>

### Installing

After installing all the prerequisites, install the project by running the command:

```sh
npm install
```

To test the installation, first run some commands related to the mongoDB. These are important to create and initiate a Replica Set, important component to make transactions in mongo, dealing with concurrency and data consistency. [Read About it](https://mongoosejs.com/docs/transactions.html)

Creating replica set instance of Mongo: open a terminal and then type:

```sh
mongod --port 27017 --dbpath /var/lib/mongodb --replSet rs0
```
> Check the path of installation of your mongo in case --dbpath is not correct.

Then open a new terminal and run the mongo shell:

```sh
mongo
```
In the mongo shell, initiate the Replica Set by typing:

```sh
rs.initiate()
```
Now you are ready to test the API, simply do:

```sh
npm run dev
```

You can also build and then run the API. Building will make use of the process of transpiling the code using babel in order to make the JavaScript compatible in current and older browsers or environments. This process will make the api slightly faster, once the transpiling process won't be done at runtime.

## Making Requests

### Register

    Route: /users/register
    Method: Post
    Body parameters:
    - name: string *required
    - password: string | Alphanumeric | Min Length: 8 *required
    - registrationNumber: string | format: XXX.XXX.XXX-XX *required
    - initialWallet: float *optional

    Returns:
     - User created
     - JWT(Json Web Token) to be used in authentication

### Login

    Route: /users/login
    Method: Post
    Body parameters:
    - password: string | Alphanumeric | Min Length: 8 *required
    - registrationNumber: string | format: XXX.XXX.XXX-XX *required

    Returns:
     - JWT(Json Web Token) to be used in authentication
    
### Consult All Users

    Route: /users/
    Method: Get
    Bearer Token Required for Authentication
    Returns:
     - List of all users created

### Consult User By Id

    Route: /users/id
    Method: Get
    Bearer Token Required for Authentication
    Returns:
     - User created.

> ID is provided by the authentication token.

### Consult User Wallet

    Route: /users/id/wallet
    Method: Get
    Bearer Token Required for Authentication
    Returns:
     - Wallet value from user.
> ID is provided by the authentication token.

## Transaction Requests

### Make Transaction

    Route: /transactions/transact
    Method: Post
    Bearer Token Required for Authentication
    Body parameters:
    - action: string | Value must be either 'withdraw' or 'deposit' *required
    - ammount: float | Value must be absolute *required

    Returns:
     - User that made the transaction
     - Transaction done
> ID is provided by the authentication token.

### Consult All Transactions

    Route: /transaction/
    Method: Get
    Bearer Token Required for Authentication
    Query Parameters:
    - dateStart: string | Date must follow the format YYYY-MM-DD *optional
    - dateEnd: string | Date must follow the format YYYY-MM-DD *optional
    Returns:
     - List of all transactions done | List of all transactions done in the given date interval.

### Consult User Transactions

    Route: /transaction/id
    Method: Get
    Bearer Token Required for Authentication
    Query Parameters:
    - dateStart: string | Date must follow the format YYYY-MM-DD *optional
    - dateEnd: string | Date must follow the format YYYY-MM-DD *optional
    Returns:
     - List of all transactions done by user| List of all transactions done by user in the given date interval.
> ID is provided by the authentication token.
## Contributors

* Thiago Filipe - <thiagofilipe@outlook.com>

