## **CRUD API**

## **How to start:**

1. Clone repository
2. Checkout to develop branch
3. Install dependencies
4. Run npm run start:dev to run app in development mode
5. Application will run on http://localhost:4000

Default port is 4000. You can change port in .env file with
PORT = port_number


## **Usage:**
1. npm run start:dev - run development mode
2. npm run start:prod - build and run production mode
3. npm run start:multi - run horizontal scaling for load balancer mode


## **Implemented endpoint: /api/users**

GET /api/users - get all users

GET /api/users/${userId} - get user by id (uuid)

POST /api/users - create user and store it in local database

PUT /api/users/${userId} - update existing user

DELETE /api/users/${userId} - delete existing user
