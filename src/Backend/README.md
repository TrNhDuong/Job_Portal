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

    ## Model
    Candidate 

        {

            name: String

            email: String

            password: String

            logo: {

                url: String,

                public_id: String

            },

            description: String,

            listSaveJobs: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'JobPost',
                }
            ],

            appliedJobs: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'JobPost',
                }
            ],
            CV: Buffer,
        }

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
    **Login endpoint**
    | **Method** | **Endpoint**                                  | **Description**                                             |
    | ---------- | --------------------------------------------- | ----------------------------------------------------------- |
    | **POST**   | `http://localhost:8080/api/loginCandidate`             | Login for candidate (returns token on success). |
    | **POST**   | `http://localhost:8080/api/loginEmployer`             | Login for employer (returns token on success). |
    | **POST**   | `http://localhost:8080/api/candidateRegister` | Register a new candidate account.                           |
    | **POST**   | `http://localhost:8080/api/employerRegister`  | Register a new employer account.                            |
    ---

    **PostJob endpoints**
    | **Method** | **Endpoint**                 | **Description**                                                       |
    | ---------- | ---------------------------- | --------------------------------------------------------------------- |
    | **GET**    | `/api/post-job/id?jobId=`       | Get all job posts created by a specific employer identified by email. |
    | **GET**    | `/api/post-job/`             | Get job post of page, with filter ,                                   |
    | **POST**   | `/api/post-job`              | Create a new job post *(employer only)*.                              |
    | **PATCH**  | `/api/post-job?jobId=`          | Update details of a specific job post.                                |
    | **PATCH**  | `/api/post-job/extend?jobId=`   | Extend the expiry date of a job post.                                 |
    | **PATCH**  | `/api/post-job/apply?jobId=`    | Add a candidate to the applicant list for a job *(apply to job)*.     |
    | **PATCH** | `/api/post-job?jobId=`          | Delete a specific job post *(employer only)*.                         |
    | **PATCH**  | `/api/post-job/saveJob?jobId=`    | Add a candidate to the applicant list for a job *(apply to job)*.     |
    | **PATCH** | `/api/post-job?removeSaveJob?jobId=`          | Delete a specific job post *(employer only)*.                         |

    ví dụ truy vấn cho get api/post-job 

    GET `/post-job?page=2&location=Hanoi&jobType=FullTime&major=IT`

    với các filter là page, location, jobType, major, salaryMin, salaryMax, experience, degree

    trong body ở saveJob, removeSaveJob, applyJob, removeApplyJob có trường email chứa email của ứng viên

    ---
    **Employer endpoints**
    | **Method** | **Endpoint**                       | **Description**                              |
    | ---------- | ---------------------------------- | -------------------------------------------- |
    | **GET**    | `/api/employer?email=`                    | Get employer information by email.           |
    | **GET**    | `/api/employer/feature`            | Get top10 branch with most job return full of data             |
    | **PATCH**  | `/api/employer?email=`             | Update employer profile identified by email. |

    GET `/api/employer?email=test@gmail.com`

    GET `/api/employer/feature` will return full of data of top10 branch

    PATCH `/api/employer?email=test@gmail.com` in body will include data update such as {"location":"asdas", "company":"asdads"}

    ---
    **Candidate endpoints**
    | **Method** | **Endpoint**              | **Description**                                                |
    | ----------- | ------------------------- | -------------------------------------------------------------- |
    | **GET**     | `/api/candidate?email=`   | Get candidate information by email.                            |
    | **POST**    | `/api/candidate`          | Register a new candidate account (create a candidate profile). |
    | **PATCH**   | `/api/candidate?email=`   | Update candidate profile identified by email.                  |

    GET `/api/candidate?email=test@gmail.com`

    POST `/api/candidate` in req.body include data of candidate for create

    PATCH `/api/candidate?email=test@gmail.com`  in body will include data update such as {"name": .. , "email":"assd"}

    ---
    **OTP endpoints**
    | **Method** | **Endpoint**              | **Description**                                                |
    | ----------- | ------------------------- | -------------------------------------------------------------- |
    | **POST**     | `/api/send-otp`   | Send an OTP mail to email                          |
    | **POST**    | `/api/verify-otp`          | Verify an OTP of email|

    ---
    **Password endpoints**
    | **Method** | **Endpoint**              | **Description**                                                |
    | ----------- | ------------------------- | -------------------------------------------------------------- |
    | **POST**     | `/api/password/candidate`   | Update password of candidate                         |
    | **POST**    | `/api/password/employer`          | Update password of employer|

    Client must send request in the body include {email, oldpassword, newpassword}

    Process logic for retype the newpassword in frontend side

    ---
    **Application endpoints**
    | **Method** | **Endpoint**              | **Description**                                                |
    | ----------- | ------------------------- | -------------------------------------------------------------- |
    | **POST**     | `/api/application?id=`   | Update the status of application                         |

    status contain in body
    POST `/api/application?id=`

    ---
    **Logo, wallpaper endpoint**
    | **Method** | **Endpoint**              | **Description**                                                |
    | ----------- | ------------------------- | -------------------------------------------------------------- |
    | **POST**     | `/api/upload/logo/employer?email=`   | Update the logo of employer                       |
    | **POST**     | `/api/upload/logo/candidate?email=`   | Update the logo of candidate                         |
    | **POST**     | `/api/upload/wallpaer?email=`   | Update the wallpaper of employer                    |

    Body (form-data) when upload image

    |**Key**   | **Type**  | **Description**|
    |----------|-----------|----------------|
    |image     | File      | The image      |

    ---
    **CV endpoint**
    | **Method** | **Endpoint**              | **Description**                                                |
    | ----------- | ------------------------- | -------------------------------------------------------------- |
    | **POST**     | `/api/upload/candidate/cv?email=`   | upload new CV                       |
    | **PATCH**     | `/api/upload/candidate/cv?email=`   | Remove CV                       |

    Body (form-data) when upload CV

    |**Key**   | **Type**  | **Description**|
    |----------|-----------|----------------|
    |cv     | File      | The cv      |





## API endpoint phần reset password

Client nhập email cần resetpassword và gửi yêu cầu tới endpoint api/send-otp

Client nhập OTP nhận từ email và gửi tới endpoint api/verify-otp/forgot/candidate với body gồm {email, otp}

Client nhận token từ server, lấy token = response.data.data với reponse là biến nhận kết quả từ api call

Client nhập mật khẩu mới, gửi tới server qua endpoint với header là token, api endpoint là api/password/reset/candidate, body gồm {email, password}

## API endpoint phần ứng tuyển

endpoint kiểm tra người dùng đã ứng tuyển 1 job hay chưa: api/application/exists

Nội dung body gửi cho server gồm: candidateId, jobId

Trả về success: true nếu đã ứng tuyển công việc này

# API endpoint report

---

## 1️⃣ Create Report

### **POST** `/report`

Tạo một report mới cho một job post.

### Request Body
```json
{
  "reportedBy": "string",
  "reason": "string",
  "jobPostId": "string"
}
```

| Field      | Type   | Required | Description               |
| ---------- | ------ | -------- | ------------------------- |
| reportedBy | string | ✅        | email người báo cáo |
| reason     | string | ✅        | Lý do report              |
| jobPostId  | string | ✅        | ID của JobPost bị report  |

### Return data
```json
{
  "success": "string",
  "message": "string",
}
```

### **GET** `/report?reportId=`

trả về data là 1 id

### **GET** `report/all`

trả về danh sách mặc định là 50 job sort theo timestamp

### **PATCH** `report`

cập nhật report, với request body chứa data cập nhật

### **DELETE** `report?reportId=`

xóa job theo id

# API endpoint statistic cho admin

## **GET** by year `api/statistic/yearly` body {year: }

Trả về thống kê theo năm

## **GET** by year `api/statistic/monthly` body {year: , month: }

Trả về thống kê theo tháng của năm

Data return có dạng {
    success:
    data: {
        daily_stats: {
            type: Map,
            of: DayStatsSchema,
            default: {} 
        },

        monthly_total: {
            candidateRegister: { type: Number, default: 0 },
            employerRegister: { type: Number, default: 0 },
            jobPost: { type: Number, default: 0 }
        },
    }
}

Để lấy tổng thống kê của tháng thì lấy monthly_total, còn từng ngày thì gọi daily_stats['1'], hay daily_stats['2'] gì đó




