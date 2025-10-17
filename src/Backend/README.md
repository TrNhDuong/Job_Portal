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
    │   ├── repository/      # Database interaction functions
    │   ├── app.js           # Main Express setup
    │   └── index.js         # Entry point
    │
    ├── .env                 # Environment variables (PORT, MONGO_URI, JWT_SECRET)
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    └── README.md

---

## Technologies used
- **Programming Language:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** Not implemetation
- **Password security:** Bcypt
- **Version control:** Git + Github

## API endpoints
    All the response from the server side comply with format: 
    {
        success, 
        message, 
        data 
    }
| **Variable** | **Data type**                 | **Description**                                                       |
| ---------- | ---------------------------- | --------------------------------------------------------------------- |
| success    | boolean       | True if the request is successful, else false. |
|message   | string | The message describe the result          |
| data   | any              | Output data                             |
---
Login endpoint
| **Method** | **Endpoint**                                  | **Description**                                             |
| ---------- | --------------------------------------------- | ----------------------------------------------------------- |
| **POST**   | `http://localhost:8080/api/login`             | Login for candidate or employer (returns token on success). |
| **POST**   | `http://localhost:8080/api/candidateRegister` | Register a new candidate account.                           |
| **POST**   | `http://localhost:8080/api/employerRegister`  | Register a new employer account.                            |
---

PostJob endpoints
| **Method** | **Endpoint**                 | **Description**                                                       |
| ---------- | ---------------------------- | --------------------------------------------------------------------- |
| **GET**    | `/api/post-job/:email`       | Get all job posts created by a specific employer identified by email. |
| **GET**    | `/api/post-job/apply/:jobId` | Get the list of all job applications in a specific job post.          |
| **POST**   | `/api/post-job`              | Create a new job post *(employer only)*.                              |
| **PATCH**  | `/api/post-job/:id`          | Update details of a specific job post.                                |
| **PATCH**  | `/api/post-job/extend/:id`   | Extend the expiry date of a job post.                                 |
| **PATCH**  | `/api/post-job/apply/:id`    | Add a candidate to the applicant list for a job *(apply to job)*.     |
| **DELETE** | `/api/post-job/:id`          | Delete a specific job post *(employer only)*.                         |

---
Employer endpoints
| **Method** | **Endpoint**                       | **Description**                              |
| ---------- | ---------------------------------- | -------------------------------------------- |
| **GET**    | `/api/employer/:email`             | Get employer information by email.           |
| **PATCH**  | `/api/employer/:email`             | Update employer profile identified by email. |



Candidate endpoint



