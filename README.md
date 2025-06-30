# Learning Management System (LMS)

**Empowering Learning Through Seamless Innovation and Impact**

## 🌐 Overview

Learning Management System (LMS) is a full-stack open-source project designed to simplify the creation of modern educational platforms. With a scalable architecture, this project supports secure authentication, course creation, lecture delivery, student progress tracking, and admin control panels — all powered by modern web technologies.

## 💡 Key Features

- 🔐 **Authentication**: JWT-based secure login
- 🎓 **Course & Lecture Management**: Admin dashboard to add/edit courses and lectures
- 📈 **Student Progress Tracking**: Monitor user learning journey
- 🌙 **Dark Mode Support**
- ☁️ **Media Upload**: Cloudinary-powered file handling
- 📦 **Reusable UI Components** using Radix primitives

## 📆 Tech Stack

### Frontend
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Axios](https://axios-http.com/)
- [Radix UI](https://www.radix-ui.com/)
- [React Router DOM](https://reactrouter.com/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [JWT Authentication](https://jwt.io/)
- [Cloudinary](https://cloudinary.com/) for media upload
- [Multer](https://github.com/expressjs/multer)

## 📁 Project Structure

```
lms/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── layout/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── server/
│   ├── controller/
│   ├── database/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   └── index.js
├── .env
├── .gitignore
├── package.json
├── README.md
└── CONTRIBUTING.md
```

## 🛠️ Getting Started

### 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) URI
- [Cloudinary Account](https://cloudinary.com/) (for media upload)

### 📅 Installation

```bash
# Clone the repository
git clone https://github.com/Indraja-54/lms

# Navigate to root
cd lms

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 🚀 Running the App

**Backend (Express):**
```bash
cd server
npm start
```

**Frontend (React):**
```bash
cd client
npm run dev
```

## 📨 Contributing

Pull requests are welcome! If you notice issues or would like to improve anything, feel free to:

1. Fork the repo
2. Create a new branch
3. Submit a pull request with a detailed description

## 📄 License

This project is licensed under the MIT License.

## 🙌 Acknowledgements

- Inspired by modern LMS platforms like [Udemy](https://www.udemy.com/) and [Coursera](https://www.coursera.org/)
- Built using open-source tools and libraries

---

For bugs, feedback, or questions, please use [GitHub Issues](https://github.com/Indraja-54/lms/issues).