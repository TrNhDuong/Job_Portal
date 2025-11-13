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
| **GET**    | `/api/post-job/id?jobId=`       | Get all job posts created by a specific employer identified by email. |
| **GET**    | `/api/post-job/`             | Get job post of page, with filter ,                                   |
| **POST**   | `/api/post-job`              | Create a new job post *(employer only)*.                              |
| **PATCH**  | `/api/post-job?jobId=`          | Update details of a specific job post.                                |
| **PATCH**  | `/api/post-job/extend?jobId=`   | Extend the expiry date of a job post.                                 |
| **PATCH**  | `/api/post-job/apply?jobId=`    | Add a candidate to the applicant list for a job *(apply to job)*.     |
| **DELETE** | `/api/post-job?jobId=`          | Delete a specific job post *(employer only)*.                         |

ví dụ truy vấn cho get api/post-job 
GET /post-job?page=2&location=Hanoi&jobType=FullTime&major=IT
với các filter là page, location, jobType, major, salaryMin, salaryMax, experience, degree

---
Employer endpoints
| **Method** | **Endpoint**                       | **Description**                              |
| ---------- | ---------------------------------- | -------------------------------------------- |
| **GET**    | `/api/employer?email=`                    | Get employer information by email.           |
| **GET**    | `/api/employer/feature`            | Get top10 branch with most job return full of data             |
| **PATCH**  | `/api/employer?email=`             | Update employer profile identified by email. |

GET /api/employer?email=test@gmail.com
GET /api/employer/feature will return full of data aof top10 branch
PATCH /api/employer?email=test@gmail.com
in body will include data update such as {"location":"asdas", "company":"asdads"}

Candidate endpoints
| **Method** | **Endpoint**              | **Description**                                                |
| ----------- | ------------------------- | -------------------------------------------------------------- |
| **GET**     | `/api/candidate?email=`   | Get candidate information by email.                            |
| **POST**    | `/api/candidate`          | Register a new candidate account (create a candidate profile). |
| **PATCH**   | `/api/candidate?email=`   | Update candidate profile identified by email.                  |

GET /api/candidate?email=test@gmail.com
POST /api/candidate
in req.body include data of candidate for create
PATCH /api/candidate?email=test@gmail.com
in body will include data update such as {"name": .. , "email":"assd"}

OTP endpoints
| **Method** | **Endpoint**              | **Description**                                                |
| ----------- | ------------------------- | -------------------------------------------------------------- |
| **POST**     | `/api/send-otp`   | Send an OTP mail to email                          |
| **POST**    | `/api/verify-otp`          | Verify an OTP of email|


Password endpoints
| **Method** | **Endpoint**              | **Description**                                                |
| ----------- | ------------------------- | -------------------------------------------------------------- |
| **POST**     | `/api/password/candidate`   | Update password of candidate                         |
| **POST**    | `/api/password/employer`          | Update password of employer|

Client must send request in the body include {email, oldpassword, newpassword}
Process logic for retype the newpassword in frontend side

Application endpoints
| **Method** | **Endpoint**              | **Description**                                                |
| ----------- | ------------------------- | -------------------------------------------------------------- |
| **POST**     | `/api/application?id=`   | Update the status of application                         |

status contain in body
POST /api/application?id=

Logo, wallpaper endpoint
| **Method** | **Endpoint**              | **Description**                                                |
| ----------- | ------------------------- | -------------------------------------------------------------- |
| **POST**     | `/api/upload/logo/employer?email=`   | Update the logo of employer                       |
| **POST**     | `/api/upload/logo/candidate?email=`   | Update the logo of candidate                         |
| **POST**     | `/api/upload/wallpaer?email=`   | Update the wallpaper of employer                    |

Body (form-data) when upload image

|**Key**   | **Type**  | **Description**|
|----------|-----------|----------------|
|Image     | File      | The image      |









