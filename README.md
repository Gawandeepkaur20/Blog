# 📝 AI-Powered Blogging Platform

A full-stack, feature-rich blogging web application built using **React.js**, **Node.js**, **Express**, and **MongoDB**, enhanced with **AI-driven content generation**, modern UI components, and social interaction features similar to Medium/Instagram-style platforms.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User registration and login with **JWT authentication**
* Secure protected routes
* User profile update with **instant profile image preview**

### ✍️ Blog Creation & Management

* Rich text editor using **React Quill**
* Create, edit, delete blog posts
* Featured image upload with preview
* Markdown-style content rendering
* Draft-ready editor integration

### 🤖 AI Integration

* **AI Blog Content Generator** integrated directly inside the editor
* AI-generated tags displayed within the editor container
* **SEO-optimized title and tag generation**
* AI-based blog image generation using **Gemini**
* No pop-ups or external prompts — seamless editor experience

### ❤️ Social Interactions

* Like / Dislike system with toggle (no page reload)
* Comment system with:

  * User avatars
  * Empty comment prevention
  * Relative timestamps (e.g., *2 hours ago*)
* Follow / Unfollow users
* Instagram-style user profile layout
* Followers / Following list navigation

### 🧠 State Management

* **Redux Toolkit** for predictable state management
* Centralized post and user reducers
* Optimized API calls without unnecessary reloads

### 🎨 Modern UI/UX

* Clean blog detail layout (image on top, article-style body)
* Components from **shadcn/ui**
* Icons using **lucide-react**
* Toast notifications for feedback
* Animated validation alerts

---

## 🛠 Tech Stack

### Frontend

* React.js
* Redux Toolkit
* React Quill
* Axios
* shadcn/ui
* lucide-react

### Backend

* Node.js
* Express.js
* MongoDB & Mongoose
* JWT Authentication
* Multer (Image Uploads)

### AI & APIs

* Google **Gemini AI**
* Hugging Face Transformers
* Google APIs (where applicable)

---

## 📂 Project Structure
```
Blog/
│
├── backend/
│   ├── middlewares/          # Authentication & custom middleware
│   ├── models/               # Mongoose schemas (User, Post, Comment, etc.)
│   ├── public/
│   │   └── images/           # Uploaded blog & profile images
│   ├── router/               # Express route handlers
│   │   ├── auth.js
│   │   ├── post.js
│   │   ├── user.js
│   │   └── comment.js
│   ├── .env                  # Environment variables
│   ├── .gitignore
│   ├── index.js              # Server entry point
│   ├── package.json
│   └── package-lock.json
│
├── frontend/                 # React frontend 
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   └── App.js
│   ├── package.json
│   └── package-lock.json
│
└── README.md

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Gawandeep20/Blog.git
cd Blog
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 3️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 4️⃣ Environment Variables (`.env`)

```env
MONGODB_URL=mongodb://localhost:27017/
PORT=5000
JWT_SECRET=12345
GEMINI_API_KEY=AIzaSyCHWtePP1vQQjJuszDt8A1RG5eprVG-iJM
```



 🔒 Security Highlights

* JWT-protected APIs
* Role-based access to posts
* Secure image uploads
* Server-side validation



📈 Future Enhancements

* Save drafts & autosave
* Blog analytics (views, engagement)
* Search & filter by tags
* Admin dashboard
* Bookmark / save posts


👩‍💻 Author

**Gawandeep Kaur**

B.Tech Computer Science Engineering

Full-Stack Web Developer



