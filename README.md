# 📝 docsHub

**A raw, minimal blog CMS for devs and digital wanderers.**  
Built with Next.js App Router, MongoDB, and TailwindCSS v4.  
Crafted for dumping thoughts, tech chaos, and clean storytelling.

---

## 🔍 Preview

### 🌐 Landing Page  
![Landing Page](https://raw.githubusercontent.com/helloAmulya/docshub/main/public/images/preview.png)

### 🔐 Admin Dashboard  
![Admin Dashboard](https://raw.githubusercontent.com/helloAmulya/docshub/main/public/images/admin-dashboard.png)

### 📄 Public Post Page  
![Post Page](https://raw.githubusercontent.com/helloAmulya/docshub/main/public/images/public-post.png)

---

## ⚙️ Stack

![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-0f172a?style=for-the-badge&logo=tailwindcss&logoColor=38bdf8)
![MongoDB](https://img.shields.io/badge/MongoDB-001e2b?style=for-the-badge&logo=mongodb&logoColor=10aa50)

---

## ✨ Features

- ✅ Admin CRUD with secure JWT routes  
- 📝 Excerpt generation + slug-based URLs  
- 🔍 Search by title, excerpt, or content  
- Separate admin and public panel

---

## 🚀 Live

> 📡 [https://docshub.space](https://docshub.space)

---




## 🛠️ Getting Started

```bash
# Clone the repo
git clone https://github.com/helloAmulya/docshub
cd docshub

# Install dependencies
npm install

# Set up environment
touch .env.local
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_super_secret

# Start the dev server
npm run dev


/app
  /admin             → admin dashboard (auth protected)
  /api/posts         → all post APIs (GET, POST, PUT, DELETE)
  /posts             → public blog pages
/components          → UI components
/lib                 → auth, DB, utils
/models              → mongoose models
/public              → images & meta
