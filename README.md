# InspireLeader - Intelligent Recruitment Platform

> **Version:** 1.2 

> **Status:** Active Development

> **Author:** Tran Nhat Duong 

## 1. Executive Summary
**InspireLeader** is not just a job listing site; it is a comprehensive recruitment ecosystem designed to solve the inefficiency of traditional job matching.

Unlike manual recruitment methods that are time-consuming and opaque, InspireLeader connects **Job Seekers** and **Employers** through a streamlined, transparent, and real-time tracking system. Our vision is to offer efficient job matching with a user-friendly interface that accelerates the entire hiring process.

## 2. System Architecture
The system is built on a robust Client-Server architecture designed for scalability and performance:

* **Core Backend:** Centralized Server handling logic and API requests.
* **Database:** **MongoDB** for flexible, high-performance data storage of user profiles and job listings.
* **Media Storage:** **Cloudinary** integration for optimized image and asset management.
* **External Services:**
    * **Mail Service:** Automated notifications for account actions and status updates.
    * **Billing System:** Integration for employer billing requests.

## 3. Key Features
Based on the project vision, the system serves three distinct user groups[cite: 50]:

### 🧑‍💻 For Job Seekers
* **Job Search:** Filter listings by location, salary, position, and experience level[cite: 74].
* **CV Management:** Upload and manage resumes directly on the profile to showcase qualifications.
* **Application Tracking:** Status updates (Submitted, Under Review, Accepted, Rejected) to ensure transparency.
* **One-Click Apply:** Streamlined submission process[cite: 78].

### For Employers
* **Recruitment Management:** Create and edit detailed job postings (requirements, salary range, location)[cite: 86].
* **Candidate Evaluation:** View applicant profiles/CVs and categorize them (e.g., Shortlisted, Rejected)[cite: 90].
* **Direct Communication:** Send interview invitations or rejection notices directly through the platform[cite: 94].

### For Administrators
* **Content Moderation:** Review and approve/remove job postings to maintain platform quality.
* **System Notifications:** Broadcast alerts to users regarding updates or policy changes.
* **User Management:** Oversee accounts to ensure compliance and security.

## 4. Non-Functional Requirements (Quality Assurance)
We are committed to delivering a high-performance experience:
* **Performance:** Response time **< 3 seconds** for data retrieval and page transitions.
* **Availability:** Designed for 24/7 continuous operation[cite: 61].
* **Security:** Data is encrypted both in transit and at rest to protect user privacy.
* **Cross-Platform:** Fully responsive on Windows, macOS, Android, and iOS.

## 5. Getting Started

### Prerequisites
* Node.js (Latest LTS)
* MongoDB (Local or Atlas connection)

### Installation
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/TrNhDuong/Job_Portal.git](https://github.com/TrNhDuong/Job_Portal.git)
    cd Job_Portal
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file and configure the following services as per the architecture:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    CLOUDINARY_URL=your_cloudinary_api_key
    MAIL_SERVICE_KEY=your_mail_service_credentials
    JWT_SECRET=your_security_secret
    ```

4.  **Run the application:**
    ```bash
    npm start
    ```

## 6. Contribution & Governance
This project follows the **Vision Document v1.2** specifications.
* **Lead Developer:** Tran Nhat Duong
* **Contributors:** Developer Team (Students)
* **Supervisor:** Lecturer

---
*© 2025 InspireLeader. All rights reserved.*