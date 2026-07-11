# 🛠️ FixItNow - Home Service Marketplace API

<div align="center">

![FixItNow Banner](https://img.shields.io/badge/Platform-FixItNow_Backend_API-2563EB?style=for-the-badge&logo=express&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-7.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Zod](https://img.shields.io/badge/Zod_Validation-v3-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe_Payment-Integrated-008CDD?style=for-the-badge&logo=stripe&logoColor=white)

**A Robust, Production-Ready, & Assignment-Compliant REST API for Home Service Bookings**

<a href="https://fixitnow-api-gh7m.onrender.com" target="_blank">🌐 Live API Base URL (Render)</a> ｜ <a href="https://documenter.getpostman.com/view/56453818/2sBY4LS2ZV" target="_blank">📖 Live API Documentation (Postman Web)</a> ｜ <a href="./FixItNow.postman_collection.json" target="_blank">📦 Postman Collection File</a>

</div>

> [!NOTE]
> ⏳ **Important Note on Live Cloud API (`Render Free Tier`):**  
> This live REST API is deployed on Render's Free Tier architecture. If the server instance has been inactive for 15+ minutes, the **initial request (`Cold-Start`) may take 20–30 seconds** to awaken the cloud service. Once awake, all subsequent requests execute instantaneously at maximum speed (`10-25ms`)!

---

## ⚡ Quick-Access Default Login Credentials (Instant Evaluation)

For immediate verification without creating users from scratch, copy any of these pre-configured credentials into **`POST /api/auth/login`** (Request `1.2` in Postman):

| Role | Email | Password | Pre-configured Capabilities & Access |
| :--- | :--- | :--- | :--- |
| **👑 ADMIN** | `admin@fixitnow.com` | `admin1234` | Full platform oversight, ban/unban users, monitor bookings, create categories. |
| **👤 CUSTOMER** | `customer@gmail.com` | `pass1234` | Browse services, book technicians, process payments, submit reviews. |
| **🔧 TECHNICIAN** | `technician@gmail.com` | `pass1234` | Update profile (`bio`, `hourlyRate`), toggle `isAvailable`, update job status. |

### Copy-Paste Ready Login Request Bodies (`POST /api/auth/login`):

#### 👑 1. Admin Login Body (`admin@fixitnow.com`)
```json
{
  "email": "admin@fixitnow.com",
  "password": "admin1234"
}
```

#### 👤 2. Customer Login Body (`customer@gmail.com`)
```json
{
  "email": "customer@gmail.com",
  "password": "pass1234"
}
```

#### 🔧 3. Technician Login Body (`technician@gmail.com`)
```json
{
  "email": "technician@gmail.com",
  "password": "pass1234"
}
```

---

## 📑 Detailed API Endpoint Guide (Step-by-Step Testing Walkthrough)

We are progressively verifying our endpoints following the exact 7-Folder sequence of our standardized Postman Collection. Below is **Section 1**, fully tested and verified:

### 1. 🔐 Authentication & User Management (`1. Authentication - Tested & Verified ✅`)

This module manages secure user onboarding, JWT generation, and profile retrieval.

> [!WARNING]
> **Strict Role Case Requirement**
> When registering new users via `POST /api/auth/register`, the `"role"` parameter **must be sent in UPPERCASE** (`ADMIN`, `CUSTOMER`, or `TECHNICIAN`).

---

#### 1.1 Register New User (`POST /api/auth/register`)
Creates a new platform user and automatically initializes default records (e.g., `TechnicianProfile` when role is `TECHNICIAN`).

* **Headers Required:** `Content-Type: application/json`
* **Response Status:** `201 Created (Success)`

##### 🟢 Copy-Paste Body: Admin Registration (`Role: ADMIN`)
```json
{
  "name": "Arafat Admin",
  "email": "admin@fixitnow.com",
  "password": "admin1234",
  "phone": "+8801711111111",
  "address": "House 12, Road 5, Dhanmondi, Dhaka, Bangladesh",
  "role": "ADMIN"
}
```

##### 🔵 Copy-Paste Body: Customer Registration (`Role: CUSTOMER`)
```json
{
  "name": "Evan Customer",
  "email": "customer@gmail.com",
  "password": "pass1234",
  "phone": "+8801711111111",
  "address": "House 12, Road 5, Dhanmondi, Dhaka, Bangladesh",
  "role": "CUSTOMER"
}
```

##### 🟠 Copy-Paste Body: Technician Registration (`Role: TECHNICIAN`)
```json
{
  "name": "Devid Technician",
  "email": "technician@gmail.com",
  "password": "pass1234",
  "phone": "+8801711111111",
  "address": "House 12, Road 5, Dhanmondi, Dhaka, Bangladesh",
  "role": "TECHNICIAN"
}
```

---

#### 1.2 Login User & Return JWT Token (`POST /api/auth/login`)
Authenticates credentials against encrypted Bcrypt hashes and issues a signed JSON Web Token (`accessToken`) valid across all protected endpoints.

* **Headers Required:** `Content-Type: application/json`
* **Response Status:** `200 OK (Success)`
* **Output Summary & Complete Details:**
  > ✔️ **Successful Login Response:** Returns `"success": true` along with a secure **`accessToken` (JWT)** and the complete authenticated **`user` object** (`id`, `name`, `email`, `role`, `phone`, `address`). For technicians, it also automatically includes their live **`technicianProfile` details** (`experienceYears`, `hourlyRate`, `isAvailable`). Copy the `accessToken` into your Postman Collection **Variables** tab (`token`) to instantly authorize all protected endpoints.

##### 🟢 Copy-Paste Body: Admin Login
```json
{
  "email": "admin@fixitnow.com",
  "password": "admin1234"
}
```

##### 🔵 Copy-Paste Body: Customer Login
```json
{
  "email": "customer@gmail.com",
  "password": "pass1234"
}
```

##### 🟠 Copy-Paste Body: Technician Login
```json
{
  "email": "technician@gmail.com",
  "password": "pass1234"
}
```

---

#### 1.3 Get Current Authenticated Profile (`GET /api/auth/me`)
Retrieves the logged-in user's profile details using their active Bearer Token.

* **Headers Required:** `Authorization: Bearer {{token}}`
* **Response Status:** `200 OK (Success)`
* **Output Summary:** Returns `"success": true` with the authenticated user's complete profile (`name`, `email`, `role`, `phone`, `address`) and associated `technicianProfile` (if applicable).

---

### 2. 🔍 Services & Technicians (`2. Services & Technicians (Public) - Tested & Verified ✅`)

Publicly accessible endpoints allowing customers and visitors to browse services (`with filters and pagination`), discover verified technicians (`checking live availability`), inspect technician profiles with reviews, and view all service categories.

---

#### 2.1 Get All Services With Filters (`GET /api/services`)
Retrieves active services across FixItNow. Supports dynamic query filtering (`searchTerm`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder`).

* **Headers Required:** *None (Public Endpoint)*
* **Query Parameters (Optional):**
  * `searchTerm`: Filter by keyword across title or description (e.g., `CCTV`, `Wiring`, `Plumbing`)
  * `minPrice` / `maxPrice`: Filter by price range (e.g., `minPrice=30&maxPrice=100`)
  * `sortBy` / `sortOrder`: Sort by field such as `price` or `createdAt` (`asc` / `desc`)
* **Response Status:** `200 OK (Success)`
* **Output Summary & Explanation:** Returns `"success": true` with pagination metadata (`page`, `limit`, `total`, `totalPages`) and an array of `data` containing active service offerings along with their assigned category (`id`, `name`) and technician details (`id`, `experienceYears`, `hourlyRate`, `isAvailable`, and `user` contact details).

---

#### 2.2 Get All Technicians (`GET /api/technicians`)
Browse verified technician profiles across FixItNow. Displays real-time availability (`isAvailable: true/false`), experience years, hourly rates, ratings, and contact details.

* **Headers Required:** *None (Public Endpoint)*
* **Response Status:** `200 OK (Success)`
* **Output Summary & Explanation:** Returns `"success": true` and an array of technician profile objects displaying profile `id`, `userId`, `bio`, `experienceYears`, `hourlyRate`, `isAvailable` status, `rating`, and complete `user` details (`name`, `email`, `phone`, `address`).

---

#### 2.3 Get Technician Profile With Reviews (`GET /api/technicians/:id`)
Retrieve comprehensive details of a specific technician (by `userId` or profile `id`), including their bio, hourly rate, live availability status, and customer ratings.

* **Headers Required:** *None (Public Endpoint)*
* **Response Status:** `200 OK (Success)`
* **How It Works & Output Summary:** Returns `"success": true` with the technician's complete professional profile (`bio`, `experienceYears`, `hourlyRate`, `isAvailable`), contact `user` details, and an array of `reviews` (`rating`, `comment`, `customer`). Currently returns `"reviews": []` (`Empty Array`) when no customer reviews have been submitted yet.
* **Where to Find the Technician ID (`:id`):**
  * Run **`2.2 Get All Technicians`** (or **`1.3 Get Current Authenticated Profile`**) in Postman.
  * Copy the `id` field from the technician profile object (e.g., `4ac5e074-e98b-4239-8c15-1db76553d0c1`).
  * Paste that `id` directly into the request URL (`GET /api/technicians/4ac5e074-e98b-4239-8c15-1db76553d0c1`) to instantly view their profile and customer feedback!

---

#### 2.4 Get All Service Categories (`GET /api/categories`)
Fetch all available service categories (`Plumbing`, `Electrical`, `Home Security & CCTV`, `House Cleaning`, `Painting`, `Carpentry`, `Appliance Repair`, `Pest Control`, etc.).

* **Headers Required:** *None (Public Endpoint)*
* **Response Status:** `200 OK (Success)`
* **Output Summary & Explanation:** Returns `"success": true` and an array of category objects containing unique category `id`, `name`, and `description`. You can copy any category `id` from this response when creating new marketplace offerings (`5.2 Create New Service`).

---

### 3. 📅 Bookings (`3. Bookings - Customer Flow Tested & Verified ✅`)

Endpoints allowing authenticated customers to book technicians (`POST /api/bookings`), view their booking history (`GET /api/bookings` with explicit `bookingId` alias), and inspect exact job details (`GET /api/bookings/:id`).

> [!IMPORTANT]
> **🔐 Mandatory Customer Authentication (`Authorization: Bearer Token`):**
> All endpoints inside Section 3 (`POST /api/bookings`, `GET /api/bookings`, and `GET /api/bookings/:id`) are **strictly protected** and restricted to `Role: CUSTOMER`.
> * **How to Authenticate:** Run **`1.2 Login User` (`POST /api/auth/login`)** with your customer credentials (`customer@gmail.com` / `Password123!`). Copy the returned `accessToken` (Access Key) and paste it into the **`Authorization -> Bearer Token`** tab of your Postman request (or in your collection's `{{token}}` variable) before clicking `Send`. Without this token, requests will return `401 Unauthorized`.

---

#### 3.1 Create New Booking (`POST /api/bookings`) - *Tested & Verified ✅*
Create a new job booking request (`status: REQUESTED`). Requires an authenticated Customer Bearer Token (`customer@gmail.com`).

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: CUSTOMER`) + `Content-Type: application/json`
* **Response Status:** `201 Created (Success)`
* **Where to Find the Required IDs (`serviceId` & `technicianId`):**
  * **`serviceId`:** Run **`2.1 Get All Services With Filters` (`GET /api/services`)** (or `2.5 Get Single Service Details`). Look right above the `"title"` field of any service item to copy its unique `"id"` (e.g., `"529366ac-73c9-4133-86cc-e7b7a951c5a6"` for *Smart Switchboard & Heavy Appliance Wiring Setup*).
  * **`technicianId`:** Run **`2.2 Get All Technicians` (`GET /api/technicians`)** or **`1.3 Get Current Authenticated Profile` (`GET /api/auth/me`)** to obtain the active technician's `"id"` (e.g., `"4ac5e074-e98b-4239-8c15-1db76553d0c1"` for *Devid Technician*).
* **Copy-Paste JSON Request Body:**
  ```json
  {
    "serviceId": "529366ac-73c9-4133-86cc-e7b7a951c5a6",
    "technicianId": "4ac5e074-e98b-4239-8c15-1db76553d0c1",
    "bookingDate": "2026-07-20T10:00:00.000Z",
    "address": "House 12, Road 5, Dhanmondi, Dhaka, Bangladesh",
    "notes": "Smart switchboard wiring setup and circuit breaker testing needed."
  }
  ```
* **How It Works & Output Summary:** Returns `201 Created` (`"success": true`) along with the newly created booking record (`id`, `bookingId`, `status: REQUESTED`, `totalPrice`, `customerId`, and `technicianId`). Copy the generated `bookingId` or `id` (e.g., `"3624ffb7-3013-42f6-9381-909770ac9b67"`) to check its details or process payments!

---

#### 3.2 Get Customer Bookings (`GET /api/bookings`)
Retrieve all bookings placed by the currently authenticated customer. Every booking object explicitly includes `bookingId` alongside `id` to eliminate ID confusion during payment or tracking.

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: CUSTOMER`)
* **Response Status:** `200 OK (Success)`
* **How It Works & Output Summary:** Returns `200 OK` (`"success": true`) along with a clean array of all job bookings placed by the logged-in customer (`status: REQUESTED`, `totalPrice`, `bookingDate`, and summarized `service` & `technician` details). This is a `GET` request, so no JSON request body is required.

---

#### 3.3 Get Single Booking Details (`GET /api/bookings/:id`)
Retrieve exact details and full information for a specific booking ID (`id` or `bookingId`).

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: CUSTOMER` or `Role: TECHNICIAN`)
* **Response Status:** `200 OK (Success)`
* **How It Works & Output Summary:** Returns `200 OK` (`"success": true`) with the complete detailed breakdown of the target booking (`status`, `totalPrice`, `address`, `notes`, `bookingDate`, and full nested `customer`, `technician`, and `service` records). This is a `GET` request, so no JSON request body is required.
* **How to Test (`Setup Path Parameter`):** Copy the unique `id` or `bookingId` from your `3.1 Create New Booking` response (or from the `3.2` list, e.g., `3624ffb7-3013-42f6-9381-909770ac9b67`), and paste it directly into the request URL: `GET /api/bookings/3624ffb7-3013-42f6-9381-909770ac9b67`.

---

### 4. 💳 Payments (`4. Payments - Stripe / SSLCommerz Integration Tested & Verified ✅`)

Endpoints allowing authenticated customers to initiate checkout sessions (`POST /api/payments/create`), verify completed transactions (`POST /api/payments/confirm`), and inspect payment history (`GET /api/payments` & `GET /api/payments/:id`).

> [!IMPORTANT]
> **🔐 Mandatory Customer Authentication (`Authorization: Bearer Token`):**
> All payment creation (`POST /api/payments/create`) and confirmation (`POST /api/payments/confirm`) endpoints are strictly protected and restricted to `Role: CUSTOMER`.
> * **Prerequisite Booking Status (`ACCEPTED`):** Before initiating payment, the target booking must be in **`ACCEPTED`** status (`booking.service.ts`). If the booking is currently `"REQUESTED"`, the technician must first hit **`5.6 Update Booking Status`** with `"status": "ACCEPTED"`.

---

#### 4.1 Create Payment Session (`POST /api/payments/create`) - *Tested & Verified ✅*
Creates a Stripe checkout payment session (`status: PENDING`) for an accepted booking.

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: CUSTOMER`) + `Content-Type: application/json`
* **Response Status:** `200 OK (Success)`
* **Copy-Paste JSON Request Body:**
  ```json
  {
    "bookingId": "3624ffb7-3013-42f6-9381-909770ac9b67"
  }
  ```
* **How It Works & Output Summary:** Returns `200 OK` (`"success": true`) along with a generated `transactionId` (e.g., `"cs_test_a1a4J6V2orMNqPwgy43UtNg19hDk4zEXJMCE5Ag2KjVspO3pjjuWwpu2VL"`) and `paymentUrl` (`https://checkout.stripe.com/pay/...`). Open the URL in your browser to simulate card checkout or copy the `transactionId` directly for instant confirmation!

---

#### 4.2 Confirm Payment Status (`POST /api/payments/confirm`) - *Tested & Verified ✅*
Verifies a completed checkout transaction. Updates the payment record `status` to `COMPLETED` and automatically advances the booking lifecycle to `PAID`.

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: CUSTOMER`) + `Content-Type: application/json`
* **Response Status:** `200 OK (Success)`
* **Copy-Paste JSON Request Body:**
  ```json
  {
    "transactionId": "cs_test_a1a4J6V2orMNqPwgy43UtNg19hDk4zEXJMCE5Ag2KjVspO3pjjuWwpu2VL"
  }
  ```
  *(Note: `paymentId` is not required; our backend verifies transactions strictly via `transactionId`.)*
* **How It Works & Output Summary:** Returns `200 OK` (`"success": true`) with `"status": "COMPLETED"`, `"paidAt"`, and confirms that the underlying booking `status` is marked as `PAID`.

---

#### 4.3 Get User Payment History (`GET /api/payments`)
Retrieve all payment records belonging to the authenticated user (`Customer` or `Technician`).

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: CUSTOMER` or `Role: TECHNICIAN`)
* **Response Status:** `200 OK (Success)`
* **How It Works & Output Summary:** Returns `200 OK` (`"success": true`) with a complete list of all transactions made by or assigned to the logged-in user (`status: COMPLETED`, `amount`, `provider`, and nested `booking` summary). This is a `GET` request, so no JSON request body is required.

---

#### 4.4 Get Single Payment Details (`GET /api/payments/:id`)
Inspect full transaction details, timestamps, and receipt data for a specific payment ID.

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: CUSTOMER` or `Role: TECHNICIAN`)
* **Response Status:** `200 OK (Success)`
* **How It Works & Output Summary:** Returns `200 OK` (`"success": true`) with the exact payment object (`status: COMPLETED`, `transactionId`, `amount`, and full nested `booking` & `customer` profiles). This is a `GET` request, so no JSON request body is required.
* **How to Test (`Setup Path Parameter`):** Copy the unique database `id` or `transactionId` of your payment (e.g., `cdb1d39c-bae6-40af-bbda-60f61e1369a2`), and paste it directly into the request URL: `GET /api/payments/cdb1d39c-bae6-40af-bbda-60f61e1369a2`.

---

### ⏳ Section 6 (Coming Up In Next Testing Phase)
* `6. Reviews (Customer Feedback)`

---

### 5. 🧑‍🔧 Technician Management (`5. Technician Management Tested & Verified ✅`)

Private flow endpoints restricted to authenticated Technicians (`Role: TECHNICIAN`). Allows updating professional bio/hourly rates, creating/publishing new marketplace services, toggling live availability status, and advancing customer booking lifecycle statuses (`ACCEPTED`, `DECLINED`, `IN_PROGRESS`, `COMPLETED`).

> [!IMPORTANT]
> **🔐 Mandatory Technician Authentication (`Authorization: Bearer Token`):**
> All endpoints in Section 5 strictly require a valid JWT token generated by logging in via `1.2 Login User` with a `Role: TECHNICIAN` account (`technician@gmail.com`).

---

#### 5.1 Update Profile & Hourly Rate (`PUT/PATCH /api/technician/profile`) - *Tested & Verified ✅*
Update the technician's professional bio, experience years, and hourly rate. Supports both `PUT` and `PATCH` methods.

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: TECHNICIAN`) + `Content-Type: application/json`
* **Response Status:** `200 OK (Success)`
* **Copy-Paste JSON Request Body:**
  ```json
  {
    "bio": "Expert Master Plumber with 10+ years of experience in fixing complex leakage",
    "experienceYears": 10,
    "hourlyRate": 45,
    "isAvailable": true
  }
  ```
* **How It Works & Output Summary:** Returns `200 OK` (`"success": true`) along with the updated technician record (`id`, `userId`, `bio`, `experienceYears`, `hourlyRate`, and `isAvailable`).

---

#### 5.2 Create New Service (`POST /api/services`) - *Tested & Verified ✅*
Authenticated Technicians (or Admins) can create and publish new services across the marketplace using structured JSON bodies.

##### 🛠️ Comprehensive Guide: How to Create & Populate Services via JSON (`POST /api/services`)
To ensure `2.1 Get All Services` returns populated data across the marketplace, create offerings using the steps below:

1. **🔐 Authentication Requirement:**
   Log in via **`1.2 Login User` (`POST /api/auth/login`)** using your technician credentials (`technician@gmail.com` / `pass1234`). Copy the returned `accessToken` into your Postman Collection **Variables** tab (`token`) or pass it in the header (`Authorization: Bearer <your_token>`).

2. **🔑 Required IDs (`categoryId` & `technicianId`):**
   * **`categoryId`:** Hit **`2.4 Get All Service Categories` (`GET /api/categories`)** or **`7.4 Get All Service Categories (Admin)`** to copy the exact `id` of your target category (e.g., `e2b0e04f-6692-4ccb-bdcc-9d78a0b39a43`).
   * **`technicianId`:** Hit **`2.2 Get All Technicians` (`GET /api/technicians`)** or **`1.3 Get Current Authenticated Profile` (`GET /api/auth/me`)** to obtain the exact `id` of your technician profile (e.g., `4ac5e074-e98b-4239-8c15-1db76553d0c1`).

3. **📦 Copy-Paste JSON Request Body:**
   ```json
   {
     "title": "Professional CCTV Installation & Wiring",
     "description": "Complete setup of 4 to 8 HD CCTV cameras with DVR configuration, mobile app linking, and hidden wiring.",
     "price": 49.99,
     "duration": 2,
     "categoryId": "e2b0e04f-6692-4ccb-bdcc-9d78a0b39a43",
     "technicianId": "4ac5e074-e98b-4239-8c15-1db76553d0c1"
   }
   ```
* **How It Works & Output Summary:** Returns `201 Created` (`"success": true`) with the generated service object and its unique `id` (to be used later when customers create bookings).

---

#### 5.3 Toggle Availability (`PUT/PATCH /api/technician/availability`) - *Tested & Verified ✅*
Switch the technician's availability status between `true` (ready for jobs) and `false` (busy/offline). When `false`, the profile appears offline across public listings.

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: TECHNICIAN`) + `Content-Type: application/json`
* **Response Status:** `200 OK (Success)`
* **Copy-Paste JSON Request Body (`Offline` or `Online`):**
  ```json
  {
    "isAvailable": false
  }
  ```
  *(To go back online, simply send `"isAvailable": true`)*
* **How It Works & Output Summary:** Returns `200 OK` (`"success": true`) with the updated `isAvailable` boolean value inside your technician profile.

---

#### 5.4 Get Technician Bookings (`GET /api/technician/bookings`) - *Tested & Verified ✅*
Retrieve all incoming, active, and past job bookings assigned to the logged-in technician.

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: TECHNICIAN`)
* **Response Status:** `200 OK (Success)`
* **How It Works & Output Summary:** Returns `200 OK` (`"success": true`) with an array of all assigned bookings (`bookingId` alias alongside `id`, complete customer details, `service`, and `status`). This is a `GET` request, so no JSON request body is required.

---

#### 5.5 Get Technician Single Booking (`GET /api/technician/bookings/:id`) - *Tested & Verified ✅*
Inspect exact details, customer contact info, and current lifecycle status for a single assigned booking.

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: TECHNICIAN`)
* **Response Status:** `200 OK (Success)`
* **How It Works & Output Summary:** Returns `200 OK` (`"success": true`) with the exact booking object (`status`, `totalPrice`, `bookingDate`, and nested profiles). This is a `GET` request, so no JSON request body is required.
* **How to Test (`Setup Path Parameter`):** Copy the `id` or `bookingId` from `5.4 Get Technician Bookings` (e.g., `3624ffb7-3013-42f6-9381-909770ac9b67`), and paste it directly into the URL: `GET /api/technician/bookings/3624ffb7-3013-42f6-9381-909770ac9b67`.

---

#### 5.6 Update Booking Status (`PATCH /api/technician/bookings/:id`) - *Tested & Verified ✅*
Advance or modify the lifecycle status of an assigned customer booking. Supports both direct `/:id` and `/:id/status` endpoint paths.

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: TECHNICIAN`) + `Content-Type: application/json`
* **Response Status:** `200 OK (Success)`
* **How to Test (`Setup Path Parameter`):** Paste the target `bookingId` into the URL: `PATCH /api/technician/bookings/3624ffb7-3013-42f6-9381-909770ac9b67`.

##### 🟢 Copy-Paste JSON Request Bodies (Pick the exact option required for your current workflow step):

1️⃣ **Option A: Accept Booking (`ACCEPTED`)**  
*(Required before the customer can proceed to Section 4 Payments)*
```json
{
  "status": "ACCEPTED"
}
```

2️⃣ **Option B: Decline Booking (`DECLINED`)**  
*(Reject an incoming job request from a customer)*
```json
{
  "status": "DECLINED"
}
```

3️⃣ **Option C: Start Work / In Progress (`IN_PROGRESS`)**  
*(Allowed only after the booking is `ACCEPTED` or `PAID`)*
```json
{
  "status": "IN_PROGRESS"
}
```

4️⃣ **Option D: Complete Job (`COMPLETED`)**  
*(Mark the service job as finished; required before the customer can submit a Review in Section 6)*
```json
{
  "status": "COMPLETED"
}
```

* **How It Works & Output Summary:** Returns `200 OK` (`"success": true`) confirming the booking status transition and returning the updated `status` string inside the data payload.

---

### 6. ⭐ Reviews (`6. Reviews & Customer Feedback Tested & Verified ✅`)

Endpoints allowing authenticated customers (`Role: CUSTOMER`) to submit 1-to-5 star ratings and feedback comments for completed jobs (`POST /api/reviews`).

> [!IMPORTANT]
> **⚠️ Mandatory Prerequisite Workflow (`Job Must Be COMPLETED First`):**
> **You CANNOT submit a review if the booking is currently `"REQUESTED"`, `"ACCEPTED"`, `"PAID"`, or `"IN_PROGRESS"`!**
> If you attempt to review an incomplete booking, the server will block you with `400 Bad Request: "You can only review completed jobs!"`.
> 
> **Step-by-Step Prerequisite Checklist Before Hitting `6.1 Create Review`:**
> 1. Go to **Section 5 ➔ `5.6 Update Booking Status` (`PATCH /api/technician/bookings/:id`)**.
> 2. Using your Technician Token (`Role: TECHNICIAN`), submit JSON body: `{"status": "COMPLETED"}`.
> 3. Verify that the response returns `200 OK` (`"status": "COMPLETED"`).
> 4. Once marked **`COMPLETED`**, switch back to your **Customer Bearer Token (`Role: CUSTOMER`)** and proceed to `6.1 Create Review` below!

---

#### 6.1 Create Review (`POST /api/reviews`) - *Tested & Verified ✅*
Submit a rating and comment for a completed booking. Automatically recalculates and updates the target technician's overall `rating` average and `totalReviews` count inside `TechnicianProfile`.

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: CUSTOMER` via `customer@gmail.com`) + `Content-Type: application/json`
* **Response Status:** `201 Created (Success)`
* **Copy-Paste JSON Request Body:**
  ```json
  {
    "technicianId": "4ac5e074-e98b-4239-8c15-1db76553d0c1",
    "bookingId": "3624ffb7-3013-42f6-9381-909770ac9b67",
    "rating": 5,
    "comment": "Outstanding service! Fixed the kitchen sink leak in under 20 minutes with zero hassle."
  }
  ```
* **Where to Find the IDs:**
  * **`technicianId`:** Copy the exact technician ID assigned to your booking (`Devid Technician` = `4ac5e074-e98b-4239-8c15-1db76553d0c1`).
  * **`bookingId`:** Copy your completed booking ID from `3.2 Get Customer Bookings` or `5.4 Get Technician Bookings` (`3624ffb7-3013-42f6-9381-909770ac9b67`).
* **How It Works & Output Summary:** Returns `201 Created` (`"success": true`) along with the newly generated review record (`rating: 5`, `comment`, `technicianId`, `customerId`). Simultaneously updates the technician's public profile badge!

---

### 7. 👑 Admin Management (`7. Admin Management - Category Creation Tested & Verified ✅`)

Platform governance endpoints (`Role: ADMIN`). Requires Admin Bearer Token (`admin@fixitnow.com`). Allows overseeing all registered users, moderating status (`ban/unban`), monitoring global bookings, and creating service categories.

---

#### 7.1 Get All Users (`GET /api/admin/users`) - *Tested & Verified ✅*
Retrieve a complete list of all registered users (Customers & Technicians) across the entire platform. Includes user roles, contact info, and ban status.

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: ADMIN` via `admin@fixitnow.com`)
* **Response Status:** `200 OK (Success)`
* **How It Works & Output Summary:** Returns `200 OK` (`"success": true, "message": "All users retrieved successfully"`) with a full array of all platform users. Each user object contains:
  * `id`, `name`, `email`, `role` (`CUSTOMER` / `TECHNICIAN` / `ADMIN`)
  * `phone`, `address`, `isBanned` (ban status), `createdAt`
* **How to Test:** This is a `GET` request — no JSON body required. Log in as Admin (`admin@fixitnow.com`), copy the `accessToken`, set it in the `Authorization: Bearer {{token}}` header, and hit **`Send`** directly!

#### 7.2 Update User Status - Ban/Unban (`PATCH /api/admin/users/:id`) - *Tested & Verified ✅*
Ban or unban any registered user (`Customer` or `Technician`) on the platform. Banned users (`isBanned: true`) lose access to their account.

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: ADMIN` via `admin@fixitnow.com`) + `Content-Type: application/json`
* **Response Status:** `200 OK (Success)`
* **How to Test (`Setup Path Parameter`):** Copy the target user's `id` from `7.1 Get All Users` (e.g., `b3e2370d-0b3d-4dfb-b50b-71b1b090037a` for `Evan Customer`), and paste it directly into the URL: `PATCH /api/admin/users/b3e2370d-0b3d-4dfb-b50b-71b1b090037a`.

##### 🟢 Copy-Paste JSON Request Bodies:

**Option A: Ban User (`isBanned: true`)**
```json
{
  "isBanned": true
}
```

**Option B: Unban User (`isBanned: false`)**
```json
{
  "isBanned": false
}
```

* **How It Works & Output Summary:** Returns `200 OK` (`"success": true`) with `"message": "User banned successfully"` or `"User unbanned successfully"` and the updated user object (`id`, `name`, `email`, `role`, `isBanned`, `updatedAt`).

#### 7.3 Get All Platform Bookings (`GET /api/admin/bookings`) - *Tested & Verified ✅*
Retrieve a complete list of every booking across the entire platform (all customers & technicians). Gives Admin a global bird's-eye view of all job transactions.

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: ADMIN` via `admin@fixitnow.com`)
* **Response Status:** `200 OK (Success)`
* **How It Works & Output Summary:** Returns `200 OK` (`"success": true`) with a full array of every booking on the platform. Each booking object contains:
  * `id`, `status` (`REQUESTED` / `ACCEPTED` / `PAID` / `IN_PROGRESS` / `COMPLETED`)
  * `totalPrice`, `bookingDate`, `address`, `notes`
  * Nested `customer` profile (`id`, `name`, `email`, `phone`)
  * Nested `technician` profile (`id`, `name`, `email`, `phone`)
* **How to Test:** This is a `GET` request — no JSON body required. Ensure the Admin Bearer Token is set in the `Authorization` header and hit **`Send`** directly!

---

#### 7.4 Get All Service Categories Admin (`GET /api/admin/categories`)
Retrieve all service categories across the platform as an Admin (`Arafat Admin`).

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: ADMIN`)
* **Response Status:** `200 OK (Success)`
* **Output Summary:** Returns `"success": true` with an array of all active service categories (`id`, `name`, `description`, `createdAt`, `updatedAt`, and `_count.services`).

---

#### 7.5 Create New Service Category (`POST /api/admin/categories`)
Create and publish a brand new service category across the platform. Admin authorization required (`Bearer {{token}}`).

* **Headers Required:** `Authorization: Bearer {{token}}` (`Role: ADMIN`) + `Content-Type: application/json`
* **Response Status:** `201 Created (Success)`
* **Output Summary:** Returns `"success": true`, `"message": "Category created successfully"`, and the newly created `data` object (`id`, `name`, `description`, `createdAt`).

##### 🟢 Copy-Paste Body: New Service Category (`Home Security & CCTV`)
```json
{
  "name": "Home Security & CCTV",
  "description": "CCTV camera installation, smart door lock setup, alarm system wiring, and security maintenance."
}
```

---

## 🛠️ Local Setup & Running Instructions

1. **Clone the Repository:**
```bash
git clone https://github.com/arafathussen/fixitnow-backend-assignment-4.git
cd fixitnow-backend-assignment-4
```
2. **Install Dependencies:**
```bash
npm install
```
3. **Configure Environment Variables (`.env`):**
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/fixitnow_db?schema=public"
JWT_SECRET="your_super_secret_jwt_key_here"
JWT_EXPIRES_IN="30d"
STRIPE_SECRET_KEY="sk_test_..."
```
4. **Run Database Migrations & Seeders:**
```bash
npx prisma migrate dev --name init
npx prisma db seed
```
5. **Start Development Server:**
```bash
npm run dev
```

---

> 🌟 **Thank You for Exploring & Evaluating FixItNow!**  
> We sincerely appreciate your valuable time and effort in reviewing this project. The **FixItNow Home Service Marketplace API** is crafted with clean architecture, strict TypeScript typing, comprehensive Zod validation, and industry-standard security practices to deliver a robust, scalable, and delightful backend ecosystem. Have a wonderful and productive day ahead! 🚀✨
