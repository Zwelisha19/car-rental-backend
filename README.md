# Car Rental System – Admin API Documentation

## Overview

This document describes the **admin API endpoints** for the Car Rental System backend. These routes allow admins to log in and access protected resources.

---

## Base URL

```
http://localhost:5000/api/admin
```

---

## Endpoints

### 1. Admin Login

* **URL:** `/login`
* **Method:** `POST`
* **Access:** Public
* **Description:** Allows an admin to log in and receive a JWT token for authentication.

**Request Body (JSON):**

```json
{
  "email": "admin@example.com",
  "password": "yourpassword"
}
```

**Response:**

* Success: JWT token and admin info
* Failure: Error message (invalid credentials)

---

### 2. Admin Dashboard

* **URL:** `/dashboard`
* **Method:** `GET`
* **Access:** Admin only (Protected by JWT & role check)
* **Description:** Returns a welcome message for the logged-in admin.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**

* Success: `{ "message": "Welcome Admin <admin_id>" }`
* Failure: `{ "message": "Not authorized, token failed" }` or `{ "message": "Admins only access" }`

---

## Notes

* JWT tokens are issued upon login and must be included in the `Authorization` header for protected routes.
* Admin routes are protected using middleware to ensure only admins can access them.
* Base URL may change depending on your deployment (localhost for local development, domain for production).


# User API – Car Rental System

This document describes the **User API endpoints** for authentication and user-related actions.

---

## 📌 Base URL
```
http://localhost:5000/api/users
```

---

## 🔑 Authentication Endpoints

### 1. Register a new user
**Endpoint:**  
```
POST /api/users/register
```

**Description:**  
Registers a new user with name, email, password, phone number, and driver license.

**Request body (JSON):**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "P@ssword123",
  "phoneNumber": "+1234567890",
  "driverLicense": "DL1234567"
}
```

**Response (JSON):**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": "64a123456789",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phoneNumber": "+1234567890",
    "role": "user"
  }
}
```

---

### 2. User login
**Endpoint:**  
```
POST /api/users/login
```

**Description:**  
Authenticates an existing user and returns a JWT token.

**Request body (JSON):**
```json
{
  "email": "johndoe@example.com",
  "password": "P@ssword123"
}
```

**Response (JSON):**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": "64a123456789",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phoneNumber": "+1234567890",
    "role": "user"
  }
}
```

---

## 🔒 Protected Routes (for later)
When you add routes that require authentication (e.g., booking history), include the token in the request header:

```
Authorization: Bearer <jwt_token>