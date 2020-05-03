# Branchly Client

The "Branchly" service enables users to store organisational details. The intention is that, ultimately, company owners will be able to store their outlet/branch details in this service and manage/distribute them online as needed. As of this version, this project intends to satisfy the rubric for the Cloud Developer Nanodegree capstone project, and represents only the *foundation* building blocks on which to build future features. 

## Reviewer Note

Thank you for reviewing my project. I chose the "Serverless" approach to this capstone since I made extensive use of Docker containers in my previous capstone project for the Udacity Fullstack Developer Nanodegree and spent a lot of time using Docker and Kubernetes in previous projects in this course. 

## Background

The intention of this capstone project was to employ different aspects of development that I have learned - namely, the learning goals were:

### API Learning Goals

### Client Learning Goals

The learning goals for the client application were to: 

1. Use React for the client (and learn about Hooks which I have not used before - Hooks is not part of the Udacity React Developer curricullum). 
2. Code is written in TypeScript to benefit from type checking (types are not currently fully implemented, though over time this will improve).
3. Unit and end-to-end (e2e) tests exist to ensure functionality works as expected and provides a level of confidence for future development and refactoring. 
4. Sentry is used for error logging and management.

The learning goals for the API were:

1. Use Serverless framework with Node.js and TypeScript running on AWS Lambda, DynamoDB and API Gateway. 
2. Code is written in TypeScript to benefit from type checking (types are not currently fully implemented, though over time this will improve).
3. Unit and integration tests exist to ensure functionality works as expected and provides a level of confidence for future development and refactoring. 
4. CloudWatch is used via Winston for logging and debugging purposes. 
5. X-Ray tracing is implemented to assist with getting an overview of the system and how it is used. 


## Repositories

The Branchly API and frontend React client are housed in separate repositories on GitHub. I decided that keeping them separate would be more suitable to my needs at this point - especially since the API and client run on separate cloud providers. Additionally, while both repos currently use Travis CI for the build pipeline, I wanted to keep the option of switching build tools in future open. Conceptually, for myself at least, it felt cleaner and simpler to keep them wholly separate and not needing to consider possible overlaps or complexities arising from using a monorepo. 

## GitHub

### Frontend Client

Please take a look at the [README](https://github.com/nicholaspretorius/sls-branches-client) file for the frontend client specific details. 

1. Clone the repo from [GitHub](https://github.com/nicholaspretorius/sls-branches-client) then cd into the project root. 
2. Run" `npm install`
3. To run locally, run: `npm run dev` (Note: `npm start` is used in the deployment process after the build step)

### Client Online

You can visit the client at: [https://branches-client.herokuapp.com/](https://branches-client.herokuapp.com/)

Please note: The client is hosted on the lowest, free tier on Heroku, as such, chances are good the client will need to "cold start" and will take a few moments to load. 

### API Online

The API used by the client is found below: 

* This client is running of the Branchly API. Details of which can be found at: [https://github.com/nicholaspretorius/sls-branches.git](https://github.com/nicholaspretorius/sls-branches.git)
* The API is running live at [https://eolgsqft2g.execute-api.eu-west-1.amazonaws.com/dev](https://eolgsqft2g.execute-api.eu-west-1.amazonaws.com/dev/)

## Running locally

* `npm run dev`

Note the app runs on PORT 3001, see [http://localhost:3001](http://localhost:3001).

## Tests

Tests are written with Jest, React Testing Library and Cypress for end-to-end (e2e) testing. 

* Run tests with: `npm test`
* Run tests with coverage: `npm run test:cov`
* Run e2e tests with: `npm run test:e2e`

## CI/CD

### Travis CI

Development is done in the "dev" branch. When a feature is ready: 

1. Commit your code to Git and push to GitHub. 
2. Travis CI will then kick off a build which will run: 
   * `npm test`
   * `npm run test:e2e`
   * `npm run build`

If all tests pass, and the build succeeds, Travis CI will push the code to Heroku. Heroku, internally, will use `npm start` to run the frontend client using `serve`. 

## Stripe

In the "Settings > Billing" section, you can enter the number of entities you want to host and you will be "charged" to a fake card via Stripe. 

In order to purchase, enter "Card Number" of `4242 4242 4242 4242` with any other data to make a (fake) "purchase".

## Development Notes

### Heroku

* `heroku git:remote -a branches-client` - adds remote for existing app named "branches-client" to local git.
* `git push heroku` - push all branches to heroku
* `git push heroku dev:master` - will push the "dev" branch to Heroku master

