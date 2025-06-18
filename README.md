# CSV-File-Utility-Tool

This project is a Node.js + PostgreSQL-based web service to **identify unique customers** across multiple orders, even when they use different contact details (email or phone number). It ensures accurate user identification by linking related records using a `Contact` table.

## 📦 Tech Stack

- **Backend:** Node.js (Express)
- **Database:** PostgreSQL (via Prisma ORM)
- **ORM:** Prisma
- **Frontend:** Simple HTML, CSS & JS (for testing)
- **CORS & JSON Body Support**

## 🚀 Features

- Handles contact linking using either phone number or email.
- Establishes a **primary contact** and dynamically links **secondary contacts**.
- Automatically deduplicates and consolidates user identities.
- Supports **idempotent behavior** across repeated requests.

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/itsmohitnamdeo/Contact-Identification.git
cd bitespeed-contact-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup PostgreSQL and Prisma

- Create a PostgreSQL database.
- Update the .env file and set your DB URL:
```bash
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<your-db-name>?schema=public"
```
- Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

### 4. Start the Server

```bash
node index.js
```

- Server will start at:
- 👉 http://localhost:3000



# 📨 API Endpoint

### POST /identify

Identify or create a customer by email and/or phone number.

---

### 🔹 Request Body:

```json
{
  "email": "doc@example.com",
  "phoneNumber": "9876543210"
}
```

### 🔹Response
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["doc@example.com"],
    "phoneNumbers": ["9876543210"],
    "secondaryContactIds": []
  }
}
```

### 🌐 Frontend UI (For Testing)
- A beautiful form is available in index.html. Just open it in your browser and test the /identify endpoint interactively.
  
![screenshot1](https://github.com/user-attachments/assets/b6ec26e3-7abf-426d-b164-d0626cf9df18)

![screenshot2](https://github.com/user-attachments/assets/24a1e779-4998-48da-b0ec-78f491fcf447)



### 🗃️ Prisma Contact Model
```bash
{
  id              Int       @id @default(autoincrement())
  phoneNumber     String?  
  email           String?  
  linkedId        Int?
  linkPrecedence  String     // 'primary' or 'secondary'
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  deletedAt       DateTime?
}
```

## Contact

If you have any questions, suggestions, or need assistance related to the CSV-File-Utility-Tool, feel free to reach out to Me.

- MailId - namdeomohit198@gmail.com
- Mob No. - 9131552292
- Portfolio : https://itsmohitnamdeo.github.io
- Linkedin : https://www.linkedin.com/in/mohit-namdeo
