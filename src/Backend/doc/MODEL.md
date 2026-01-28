# 🗄️ Job Portal Database Models

This document provides a detailed overview of the MongoDB data models used in the Job Portal Backend.

## 📋 Overview

The database uses **MongoDB** with **Mongoose** as the ODM. The core entities are **Candidate**, **Employer**, and **JobPost**, supported by auxiliary models like **Application**, **OTP**, **Report**, **Payment** and **Statistic**.

---

## 👤 Users

### 🧑‍💼 Candidate
Represents a job seeker.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | ✅ | Full name of the candidate. |
| `email` | String | ✅ | Unique email address. |
| `password` | String | ✅ | Hashed password. |
| `logo` | Object | ❌ | Avatar image `{ url, public_id }`. |
| `description` | String | ❌ | Bio or self-description. |
| `listSaveJobs` | ObjectId[] | ❌ | List of saved `JobPost` IDs. |
| `appliedJobs` | ObjectId[] | ❌ | List of applied `JobPost` IDs. |
| `CV` | Array | ❌ | List of uploaded CVs `{ url, public_id, name, uploadedAt }`. |
| `timeStamp` | Date | ❌ | Account creation date (Default: `now`). |

### 🏢 Employer
Represents a company or recruiter.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `company` | String | ✅ | Company name. |
| `email` | String | ✅ | Unique email address. |
| `name` | String | ❌ | Representative's name (CEO/HR). |
| `password` | String | ✅ | Hashed password. |
| `logo` | Object | ❌ | Company logo `{ url, public_id }`. |
| `wallpaper` | Object | ❌ | Cover image `{ url, public_id }`. |
| `phone` | String | ❌ | Contact phone number. |
| `address` | String | ✅ | Company address. |
| `description` | String | ❌ | Company description. |
| `website` | String | ❌ | Company website URL. |
| `contact` | Object | ❌ | Public contact info `{ email, phone }`. |
| `scale` | String | ❌ | Company size (e.g., "50-100 employees"). |
| `jobPosted` | ObjectId[] | ❌ | List of created `JobPost` IDs. |
| `point` | Number | ❌ | Credits/Points for posting jobs (Default: 0). |
| `timeStamp` | Date | ❌ | Account creation date (Default: `now`). |

---

## 💼 Jobs & Applications

### 📝 JobPost
Represents a job listing.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | ✅ | Job title. |
| `companyEmail` | String | ✅ | Email of the posting employer. |
| `company` | String | ✅ | Company name. |
| `position` | String | ✅ | Job position/role. |
| `detailedAddress`| String | ✅ | Specific address. |
| `location` | String | ✅ | City/Province. |
| `logo` | Object | ❌ | Company logo snapshot. |
| `salary` | Object | ✅ | `{ minSalary, maxSalary, currency }`. |
| `jobType` | String | ✅ | Enum: `Full-time`, `Part-time`, `Internship`, `Freelance`, `Contract`. |
| `major` | String | ✅ | Enum: `IT`, `Business`, `Finance`, `Marketing`, etc. |
| `customMajor` | String | ❌ | Used if major is 'Other'. |
| `degree` | String | ✅ | Required degree (e.g., `Bachelor`, `Master`). |
| `experience` | Number | ✅ | Years of experience required. |
| `postedAt` | Date | ❌ | Date posted (Default: `now`). |
| `state` | String | ✅ | `Open`, `Closed`, `Pending`. |
| `expireDay` | Date | ❌ | Expiration date. |
| `daysLeft` | Number | ❌ | Calculated days remaining (for closed jobs). |
| `applicants` | ObjectId[] | ❌ | List of `Application` IDs. |
| `metric` | Object | ❌ | Stats: `{ new, interviewing, hired }`. |
| `description` | String | ✅ | Full job description. |
| `requirement` | String | ❌ | Job requirements. |
| `welfare` | String | ❌ | Benefits and welfare. |
| `viewed` | Number | ❌ | View count (Default: 0). |

### 📄 Application
Connects a Candidate to a JobPost.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `candidateId` | ObjectId | ✅ | Reference to `Candidate`. |
| `jobId` | ObjectId | ✅ | Reference to `JobPost`. |
| `contactEmail` | String | ✅ | Email for contact regarding this application. |
| `CV_url` | String | ✅ | Link to the specific CV used. |
| `appliedDate` | Date | ❌ | Date of application (Default: `now`). |
| `label` | String | ❌ | Status: `New`, `Viewed`, `Shortlisted`, `Interviewing`, `Offered`, `Rejected`, `Hired`. |

**Indexes:**
- Compound unique index on `{ candidateId: 1, jobId: 1 }` to prevent duplicate applications.

---

## 🛡️ Security & Verification

### 🔑 OTP
One-Time Password for email verification.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | String | ✅ | Email associated with the OTP. |
| `otp` | String | ✅ | The OTP code. |
| `expireAt` | Date | ❌ | Expiration time (TTL index: 120 seconds). |

---

## 🔧 Utilities

### 🚩 Report
User reports on job posts.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `reportedBy` | String | ✅ | Email of the reporter. |
| `reason` | String | ✅ | Reason for reporting. |
| `JobPost` | ObjectId | ✅ | Reference to the reported `JobPost`. |
| `timeStamp` | Date | ❌ | Time of report. |

### 💳 Payment
Transaction records (presumably for points).

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | String | ✅ | User email. |
| `point` | String | ✅ | Points amount (stored as String?). |
| `note` | String | ❌ | Transaction note. |
| `state` | String | ❌ | Transaction state. |
| `createdAt` | Date | ❌ | Transaction date. |

### 📊 Statistic (Dashboard)
Stores aggregated data for the admin dashboard.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | String | ✅ | Identifier (e.g., "YYYY-MM"). |
| `daily_stats` | Map | ❌ | Map of daily stats. |
| `monthly_total`| Object | ❌ | Aggregated totals for the month. |
| `last_updated` | Date | ❌ | Last update timestamp. |

**Structure of `DayStatsSchema` & `monthly_total`:**
- `candidateRegister`: Number
- `employerRegister`: Number
- `jobPost`: Number
