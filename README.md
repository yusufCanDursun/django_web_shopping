# 🛒 Django Web Shopping

**Django Web Shopping** is a modern full-stack e-commerce web application. It consists of a Django REST Framework backend and a React frontend. Users can browse products, register/log in, and manage their shopping cart. The backend uses MySQL for robust data storage and JWT for secure authentication.

---

## 🔧 Technologies Used

### Backend
- 🐍 Python 3.10+
- 🌐 Django 4.x
- 🔐 Django REST Framework
- 🛢️ MySQL (as the database)
- 🔑 JWT-based user authentication
- 📦 Apps:
  - `account` – user registration, login, and profile management
  - `products` – product catalog and detail views
  - `cart` – shopping cart functionality

### Frontend
- ⚛️ React
- 🔗 Axios for API communication
- 🖼️ Dynamic product image rendering
- 🎨 Simple, responsive UI

---

## 🚀 Getting Started

### 1. Configure MySQL Database

Create a MySQL database and update your credentials in:
`backend/eshop/eshop/settings.py`

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_db_name',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

2. Backend Setup

cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

3. Frontend Setup

cd frontend
npm install
npm start

The frontend will run at http://localhost:3000 and the Django backend at http://localhost:8000.

✨ Features
User registration and login with secure JWT authentication

Product listing and detailed product view

Add/remove products to/from the shopping cart

Media support for product images

Fully decoupled architecture (React + DRF)

MySQL-based persistent storage
