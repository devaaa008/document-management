# Create Nest Application
Use nest commands to create modules,controllers and services
Configure the application
Basic setup
Organise code structure  and Readme file
Create baseConfig file to access configurations from env
# Database Connection
Created database schema using typeorm
Created user,auth,document,ingestion,blacklisted entities
# Library Setup
Added s3 service and request data in the library which is used by other services to handle s3 request and to get the details of user context
# User endpoints
Created user endpoints in user controller to register, get all the user details and update roles
Register endpoint is accessible to all the end users
But getAllUsers can be accessible by admin
Created user service to communicate with database
# Auth Endpoint
Created auth controller for user login logout functionality
Used JwtService for jwt authentication
Added AuthGuard for local based authentication which calls local strategy to validate user
For logout functionality when user calls logout endpoint the token from the request is added to blocklisted token in the database
Upon next authorisation user will not be able to access resources
# Document endpoint
Added document controller which handles create,update,list and delete documents from the database aswell as s3
Document service handles all the operations including calling s3 service to upload document and add url to the table
All the endpoints are only accessible to either admin or editor
# Ingestion endpoint
Added ingestion endpoint got ingestion operation
There are two endpoints basically trigger and status
Trigger endpoint calls the ingestion service which handles ingestion operation
Ingestion service checks for the document id, if the document is present in the document table, it gets the payload for the python ingestion endpoint
The jobid and ingestion payload is stored in the ingestionJob table to track
Using status endpoint we can track the job
# A dockerfile is created which can be used to create image and run in the system
# Added swagger for the endpoints for api references
# Readme file can be used to know how to to run the application and how it can be used in the production
