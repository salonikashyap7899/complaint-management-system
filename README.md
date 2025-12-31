
# 📌 Complaint Management System (CMS)

A **web-based Complaint Management System** developed using **Next.js and MongoDB**.
The system helps users register complaints online and allows administrators to manage, track, and resolve compl
aints efficiently.

This project is developed as part of the **BCA (Computer Applications) curriculum** and follows standard software engineering practices.

---

## 🎯 Project Objective

The objective of this project is to:

* Digitize the complaint registration process
* Reduce manual paperwork
* Improve transparency and response time
* Provide a centralized system for complaint handling

---

## ✨ Key Features

### User Features

* User Registration & Login
* Submit complaints
* Track complaint status
* View complaint history

### Admin Features

* Admin login
* View all complaints
* Update complaint status (Pending / In Progress / Resolved)
* Manage users

---

## 🛠️ Technology Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Frontend       | Next.js (App Router)         |
| Backend        | Next.js API Routes (Node.js) |
| Database       | MongoDB (Atlas)              |
| Styling        | Tailwind CSS / ShadCN UI     |
| Authentication | JWT-based Authentication     |
| Deployment     | Vercel / Cloud Ready         |

---

## 🗂️ Project Structure

```
cms/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   └── register/route.js
│   │   ├── complaints/
│   │   └── users/
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
├── hooks/
├── lib/
│   └── mongodb.js
├── public/
├── .env.local
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/salonikashyap7899/complaint-management-system
cd cms
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create `.env.local` file:

```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cms?retryWrites=true&w=majority
```

⚠️ Do NOT upload `.env.local` to GitHub.

---

### Step 4: Run the Project

```bash
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## 🔐 API Documentation

### 🔹 Register User

**POST** `/api/auth/register`

**Request Body**

```json
{
  "name": "User Name",
  "email": "user@gmail.com",
  "password": "password123"
}
```

---

### 🔹 Login User

**POST** `/api/auth/login`

**Request Body**

```json
{
  "email": "user@gmail.com",
  "password": "password123"
}
```

---

### 🔹 Create Complaint

**POST** `/api/complaints`

**Request Body**

```json
{
  "title": "Internet Issue",
  "description": "Internet not working properly"
}
```

---

### 🔹 Get Complaints

**GET** `/api/complaints`

---

## 🖼️ Screenshots

*Add screenshots here before final submission or PDF export*

```
📸 Login Page
📸 User Dashboard
📸 Complaint Form
📸 Admin Dashboard
📸 Complaint Status Page
```

👉 For college PDF:
Take screenshots → paste them under this section.

---

## 🔒 Security Features

* Encrypted passwords
* Secure API routes
* MongoDB Atlas authentication
* Environment variable protection

---

## 📈 Future Enhancements

* Email notifications
* Complaint priority system
* File upload with complaints
* Role-based dashboard UI
* Analytics & reports

---

## 🎓 Academic Details

* **Course**: Bachelor of Computer Applications (BCA)
* **Project Type**: Web Application
* **Category**: Full Stack Development
* **Purpose**: Academic Project

---

## 👩‍💻 Author

**Saloni Kashyap**
BCA – Computer Applications
Frontend & Full Stack Developer

🔗 GitHub:
[https://github.com/salonikashyap7899](https://github.com/salonikashyap7899)

---

## 📄 License

This project is developed **for educational purposes only**.

---

## ✅ NEXT STEPS (IMPORTANT)

1️⃣ Replace README.md with this content
2️⃣ Add screenshots
3️⃣ Commit & push:

```bash
git add README.md
git commit -m "Final project README for college and recruiters"
git push
```

---

If you want next:

* 📄 **60–70 page project report**
* 🧾 **DFD, ER Diagram**
* 🧠 **Viva questions & answers**
* 🧑‍💼 **Resume project description**

Just say **“next”** 😊
