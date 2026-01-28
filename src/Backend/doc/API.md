# 📘 Job Portal API Documentation

Welcome to the **Job Portal API**. This documentation provides a comprehensive guide to the available endpoints, their usage, and response formats.

## 🌐 Base URL

All API requests should be prefixed with:
`http://localhost:8080/api`

## 📦 General Response Format

Standard response structure for all endpoints:

```json
{
  "success": true,   // boolean: true if successful, false otherwise
  "message": "Operation successful", // string: description of the result
  "data": { ... }    // any: the payload data (object, array, or null)
}
```

---

## 🔐 Authentication

### Candidates
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/loginCandidate` | Authenticate a candidate. Returns a JWT token. |
| `POST` | `/candidateRegister` | Register a new candidate account. |

### Employers
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/loginEmployer` | Authenticate an employer. Returns a JWT token. |
| `POST` | `/employerRegister` | Register a new employer account. |

---

## 👤 User Management

### Candidate Profile
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/candidate?email={email}` | Retrieve candidate profile details. |
| `POST` | `/candidate` | Create a candidate profile (internal use). |
| `PATCH` | `/candidate?email={email}` | Update candidate profile details. |

**Example Update Body:**
```json
{
  "name": "Nguyen Van A",
  "phone": "0987654321"
}
```

### Employer Profile
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/employer?email={email}` | Retrieve employer profile details. |
| `GET` | `/employer/feature` | Get top 10 featured brands/employers. |
| `PATCH` | `/employer?email={email}` | Update employer profile details. |

**Example Update Body:**
```json
{
  "companyName": "Tech Corp",
  "location": "Hanoi"
}
```

---

## 💼 Job Management

### Job Posts
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/post-job` | Create a new job post (Employer only). |
| `GET` | `/post-job` | List job posts with pagination and filtering. |
| `GET` | `/post-job/id?jobId={id}` | Get all jobs for a specific employer. |
| `PATCH` | `/post-job?jobId={id}` | Update a job post. |
| `DELETE` | `/post-job?jobId={id}` | Delete a job post. |
| `PATCH` | `/post-job/extend?jobId={id}` | Extend job post expiry date. |

### Job Actions
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `PATCH` | `/post-job/apply?jobId={id}` | Apply for a job (adds candidate to applicant list). |
| `PATCH` | `/post-job/saveJob?jobId={id}` | Save a job for later. |
| `PATCH` | `/post-job/removeSaveJob?jobId={id}` | Remove a saved job. |

**Filtering Options (GET /post-job):**
Query parameters: `page`, `location`, `jobType`, `major`, `salaryMin`, `salaryMax`, `experience`, `degree`.

**Example Request:**
`GET /post-job?page=1&location=Hanoi&major=IT`

---

## 📝 Applications & CVs

### Application Status
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/application?id={appId}` | Update application status. |
| `POST` | `/application/exists` | Check if candidate already applied. |

**Check Application Body:**
```json
{
  "candidateId": "...",
  "jobId": "..."
}
```

### CV Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/upload/candidate/cv?email={email}` | Upload a new CV (Multipart/form-data). |
| `PATCH` | `/upload/candidate/cv?email={email}` | Remove existing CV. |

**Upload Key:** `cv` (File)

---

## 🛡️ Security & Utilities

### Password & OTP
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/send-otp` | Send OTP to email. |
| `POST` | `/verify-otp` | Verify OTP code. |
| `POST` | `/password/candidate` | Change candidate password. |
| `POST` | `/password/employer` | Change employer password. |

**Change Password Body:**
```json
{
  "email": "user@example.com",
  "oldpassword": "oldPass",
  "newpassword": "newPass"
}
```

### Forgot Password Flow
1. **Request OTP:** `POST /api/send-otp` with `{email}`.
2. **Verify OTP:** `POST /api/verify-otp/forgot/candidate` with `{email, otp}`. Returns a reset token.
3. **Reset Password:** `POST /api/password/reset/candidate` with `{email, password}` (Include token in headers).

### Image Uploads
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/upload/logo/employer?email={email}` | Upload employer logo. |
| `POST` | `/upload/logo/candidate?email={email}` | Upload candidate avatar. |
| `POST` | `/upload/wallpaper?email={email}` | Upload employer wallpaper. |

**Upload Key:** `image` (File)

---

## ⚠️ Reporting System

Basic reporting functionality for job posts.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/report` | Create a report. |
| `GET` | `/report?reportId={id}` | Get specific report details. |
| `GET` | `/report/all` | Get all reports (limit 50). |
| `PATCH` | `/report` | Update a report. |
| `DELETE` | `/report?reportId={id}` | Delete a report. |

**Create Report Body:**
```json
{
  "reportedBy": "user@email.com",
  "reason": "Spam/Scam",
  "jobPostId": "job123"
}
```

---

## 📊 Admin Statistics

### Yearly Stats
`GET /api/statistic/yearly`
**Body:** `{ "year": 2024 }`

### Monthly Stats
`GET /api/statistic/monthly`
**Body:** `{ "year": 2024, "month": 5 }`

**Response Data Structure:**
```json
{
    "daily_stats": {
        "1": { ... }, // Data for day 1
        "2": { ... }  // Data for day 2
    },
    "monthly_total": {
        "candidateRegister": 100,
        "employerRegister": 5,
        "jobPost": 50
    }
}
```
