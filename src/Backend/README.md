# Server of Job Portal

## Architecture Overview
    Backend/
    │
    ├── doc/             # Documentation
    │   ├── API.md       # API Specification
    │   └── MODEL.md     # Database Models
    │
    ├── config/          # Database connection, environment setup
    ├── controller/      # Business logic for each route
    ├── model/           # MongoDB schemas (Candidate, Employer, Job, Application)
    ├── routes/          # API endpoints definitions
    ├── middleware/      # Auth, validation, error handling
    ├── repository/      # Database interaction functions
    ├── app.js           # Main Express setup
    ├── index.js         # Entry point
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
- **Password security:** Bcrypt
- **Version control:** Git + Github


