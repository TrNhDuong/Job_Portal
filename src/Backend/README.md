# Server of Job Portal

## Architecture Overview
Backend/
│
├── src/
│   ├── config/          # Database connection, environment setup
│   ├── controllers/     # Business logic for each route
│   ├── models/          # MongoDB schemas (Candidate, Employer, Job, Application)
│   ├── routes/          # API endpoints definitions
│   ├── middlewares/     # Auth, validation, error handling
│   ├── app.js           # Main Express setup
│   ├── repository/      # Database function
│   └── index.js         # Entry point
│
├── .env                 # Environment variables (PORT, MONGO_URI, JWT_SECRET)
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

## Technologies used
- **Programming Language:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** Not implemetation
- **Password security:** Bcypt
- **Version control:** Git + Github

## API endpoints
Login/Register endpoints
Method      Endpoint                                        Description
POST        http://localhost:8080/api/login                 
POST        http://localhost:8080/api/candidateRegister
POST        http://localhost:8080/api/employerRegister

PostJob endpoints
Method      Endpoint                                        Description
GET	        post-job/:email	                                Get all id job posts of specific employer identified by unique email
GET	        post-job/apply/:jobId"	                        Get the list of all job applications in a postjob identified by jobId
POST	    post-job	                                    Create a new job post (employer only).
PATCH	    post-job/:id	                                Update details of a specific job post
PATCH	    post-job/extend/:id	                            Extend the expiry date of a job post.
PATCH	    post-job/apply/:id	                            Add a candidate to the applicant list for a job (candidate applies).
DELETE	    api/post-job/:id	                            Delete a specific job post (employer only).

Employer endpoints
Method	Endpoint	                                        Description
GET	    employer/:email	                                    Get employer identified by email.
POST	employer	                                        Create a new employer.
PATCH	employer/:email	                                    Update employer profile identified by email
GET	    employer/:email/posted-jobs	                        Get all postjob of employer identified by email

Candidate endpoint



