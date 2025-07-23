# Typescript Web Server

This is the backend server for a Twitter-like application called "Chirpy". It's built with TypeScript, Node.js, and Express, and it provides a RESTful API for managing users, "chirps" (posts), and authentication.

---

## 📚 Project Context: Boot.dev "Web Servers" Course

This project was developed as part of the **Boot.dev "Web Servers"** course. The course is a culmination of the back-end track, focusing on the fundamental concepts and practical implementation of HTTP servers. It emphasizes building a web server from scratch in TypeScript, understanding its underlying mechanics, and leveraging production-ready tools.

---

## Features

-   **User Management**: Create and update user accounts.
-   **Authentication**: Secure user login with JSON Web Tokens (JWTs) and Refresh Tokens.
-   **Password Security**: Passwords are securely hashed using `bcrypt`.
-   **CRUD for Chirps**: Full Create, Read, and Delete operations for chirps.
-   **Content Moderation**: Automatically censors a predefined list of "bad words" in chirps.
-   **Webhook Integration**: Listens for webhooks from the "Polka" service to handle user upgrades.
-   **Database**: Uses PostgreSQL with Drizzle ORM for type-safe database queries.
-   **Migrations**: Database schema migrations are handled by Drizzle ORM and run automatically on startup.
-   **Configuration**: Environment-based configuration for easy setup across different environments (dev, staging, prod).
-   **API Health**: Includes health check and basic metrics endpoints.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Language**: TypeScript
-   **Database**: PostgreSQL
-   **ORM**: Drizzle ORM
-   **Authentication**: `jsonwebtoken`, `bcrypt`

## Prerequisites

Before you begin, ensure you have the following installed:

-   Node.js (v18 or higher is recommended)
-   A package manager like `npm`, `yarn`, or `pnpm`
-   A running PostgreSQL instance

## Getting Started

Follow these steps to get the server up and running on your local machine.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd web-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project. You can copy the example below and fill in your specific details.

```env
# .env

# Server Configuration
# PORT: The port the server will listen on.
# PLATFORM: The current environment (e.g., "dev", "production"). "dev" allows access to the /admin/reset endpoint.
PORT=8080
PLATFORM=dev

# Database
# DB_URL: Your PostgreSQL connection string.
DB_URL="postgresql://user:password@localhost:5432/database_name"

# JWT
# JWT_SECRET: A strong, unique secret for signing JWTs.
JWT_SECRET="a-very-long-and-super-secret-key-for-jwt"

# Polka Webhook
# POLKA_KEY: The API key for authenticating requests from the Polka service.
POLKA_KEY="your-polka-api-key"
```

### 4. Run database migrations

The server is configured to run database migrations automatically on startup, so no manual step is needed.

### 5. Start the server

```bash
npm start
```

The server should now be running at `http://localhost:8080`.

## API Endpoints

Here is a summary of the available API endpoints.

### Health & Admin

-   `GET /api/healthz`: Health check endpoint. Returns `200 OK` if the server is running.
-   `GET /admin/metrics`: Displays an admin HTML page with server visit counts.
-   `POST /admin/reset`: Resets the database. Only available when `PLATFORM=dev`.

### Authentication

-   **`POST /api/login`**: Authenticate a user.
    -   **Body**: `{ "email": "user@example.com", "password": "password123" }`
    -   **Response (200 OK)**: User data, JWT, and refresh token.

-   **`POST /api/refresh`**: Refresh an access token using a valid refresh token.
    -   **Headers**: `Authorization: Bearer <refresh_token>`
    -   **Response (200 OK)**: A new JWT.

-   **`POST /api/revoke`**: Revoke a refresh token.
    -   **Headers**: `Authorization: Bearer <refresh_token>`
    -   **Response**: `204 No Content`.

### Users

-   **`POST /api/users`**: Create a new user.
    -   **Body**: `{ "email": "user@example.com", "password": "password123" }`
    -   **Response (201 Created)**: The new user's data (excluding password).

-   **`PUT /api/users`**: Update an authenticated user's email and password.
    -   **Headers**: `Authorization: Bearer <jwt_token>`
    -   **Body**: `{ "email": "new@example.com", "password": "newpassword123" }`
    -   **Response (200 OK)**: The updated user's data.

### Chirps

-   **`POST /api/chirps`**: Create a new chirp.
    -   **Headers**: `Authorization: Bearer <jwt_token>`
    -   **Body**: `{ "body": "This is my first chirp!" }`
    -   **Response (201 Created)**: The new chirp data.

-   **`GET /api/chirps`**: Retrieve all chirps.
    -   **Query Params**:
        -   `authorId=<user_id>` (optional): Filter chirps by author.
        -   `sort=<asc|desc>` (optional): Sort chirps by creation date (default: `desc`).
    -   **Response (200 OK)**: An array of chirps.

-   **`GET /api/chirps/:chirpId`**: Retrieve a single chirp by its ID.
    -   **Response (200 OK)**: The chirp data.

-   **`DELETE /api/chirps/:chirpId`**: Delete a chirp. The authenticated user must be the author.
    -   **Headers**: `Authorization: Bearer <jwt_token>`
    -   **Response**: `204 No Content` on success, `403 Forbidden` if not the author.

### Webhooks

-   **`POST /api/polka/webhooks`**: Webhook endpoint for Polka service events.
    -   **Headers**: `Authorization: ApiKey <polka_api_key>`
    -   **Body**: `{ "event": "user.upgraded", "data": { "userId": "<user_id>" } }`
    -   **Action**: Upgrades a user to "Chirpy Red" status if the event is `user.upgraded`.
    -   **Response**: `204 No Content` on success or for unhandled events. `401 Unauthorized` for an invalid API key. `404 Not Found` if the user doesn't exist.