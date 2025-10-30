
# User Profile Management API


A lightweight and efficient **User Profile Management API** build using **Express**, **Typescript** and **Mongodb (Mongoose)** . This project focus on performing CRUD operation for user profiles - such as Creating, Reading, updating and deleteing user information. 

-----

## Features
- Type-safe API using **TypeScript**
- Create new user profile
- Retrive all data or single user details
- Update user Information 
- Delete user records
- Request body validation using **Joi**
- Input validation and clean Typescript structure



## Folder structure

 Project/ <br/>
|- dist/<br/>
 |- (compiled javascript files)<br/>
|- src/<br/>
 |- config/<br/>
 |- controllers/<br/>
 |- interfaces/<br/>
 |- models/<br/>
 |- routes/<br/>
 |- seed/<br/>
 |- utils/<br/>
 |- index.ts<br/>
|- .env<br/>
|- tsconfig.json<br/>




----

## Installation and setup

### Clone and repositry
```bash
git clone https://github.com/Akshai-muraleedharan/user-profile-management-typescript.git
cd project

```

### Install Dependencies

```bash

npm install

```

### Create ***.env*** file 

Add your configuration details:

```ini

PORT=8004
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/user-profile-management

```
------

## Build and Run

 ### Development Mode
  ``` bash

  npm run dev

  ```

  ### Build TypeScript to JavaScript

  ``` bash

    npm run build
  ```

  This will compile TypeScript files from the src/ folder into the dist/ folder.


### Start Production Server

``` bash

npm run start

```

This runs the compiled JavaScript files from dist/.

-------

## API Endpoints

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| POST   | `/api/v1/users`     | Create a new user   |
| GET    | `/api/v1/users`     | Get all users       |
| GET    | `/api/v1/users/:id` | Get user by ID      |
| PUT    | `/api/v1/users/:id` | Update user details |
| DELETE | `/api/v1/users/:id` | Delete user         |


## AUTHOR

**Akshai Muraleedharan**<br/>
**[GitHub](https://github.com/Akshai-muraleedharan/)**<br/>


-----

## License

This project is licensed under the MIT License.