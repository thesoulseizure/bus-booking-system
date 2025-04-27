# Bus Booking System

A web application for booking bus tickets, built with Spring Boot (backend) and React (frontend). The system allows users to search for buses, book tickets, and manage bookings.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Setup and Configuration](#project-setup-and-configuration)
    - [Prerequisites](#prerequisites)
    - [Step 1: Clone the Repository](#step-1-clone-the-repository)
    - [Step 2: Set Up the Backend (Spring Boot)](#step-2-set-up-the-backend-spring-boot)
    - [Step 3: Set Up the Frontend (React)](#step-3-set-up-the-frontend-react)
    - [Step 4: Test the Application](#step-4-test-the-application)
- [API Documentation](#api-documentation)
    - [Base URL](#base-url)
    - [Authentication](#authentication)
    - [Endpoints](#endpoints)
    - [Data Validation Rules Summary](#data-validation-rules-summary)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

## Overview
The Bus Booking System is a web application that allows users to search for available buses, book tickets, and view their booking history. The system is built with a **Spring Boot** backend (Java) and a **React** frontend, using **MySQL** as the database.

## Tech Stack
- **Backend**: Spring Boot, Spring Data JPA, MySQL
- **Frontend**: React, Axios
- **Database**: MySQL
- **Authentication**: JWT-based (assumed based on token usage in the code)

## Project Setup and Configuration

### Prerequisites
1. **Java Development Kit (JDK)**: JDK 17 or higher
2. **Node.js and npm**: Node.js 18.x or higher, npm 8.x or higher
3. **MySQL**: MySQL 8.0 or higher
4. **Git**: For cloning the repository
5. **IntelliJ IDEA** (or any IDE): For running the backend
6. **IDE for React**: VS Code or IntelliJ IDEA

### Step 1: Clone the Repository
Clone the project from GitHub.

```bash
git clone https://github.com/your-username/bus-booking-system.git
cd bus-booking-system
```

### Step 2: Set Up the Backend (Spring Boot)

#### 1. Configure the Database
- **Install MySQL**: Ensure MySQL is installed and running.
- **Create the Database**:
    - Open MySQL Workbench (or your preferred MySQL client).
    - Run the following SQL to create the database:
      ```sql
      CREATE DATABASE busbooking;
      ```
- **Configure `application.properties`**:
    - Open `src/main/resources/application.properties` in the backend project.
    - Update the database connection settings:
      ```properties
      spring.datasource.url=jdbc:mysql://localhost:3306/busbooking?useSSL=false&serverTimezone=UTC
      spring.datasource.username=your-mysql-username
      spring.datasource.password=your-mysql-password
      spring.jpa.hibernate.ddl-auto=update
      spring.jpa.show-sql=true
      ```
    - Replace `your-mysql-username` and `your-mysql-password` with your MySQL credentials.

#### 2. Initialize the Database with Sample Data
- Run the following SQL in MySQL Workbench to populate the `bus` table:
  ```sql
  INSERT INTO bus (id, from_location, to_location, departure_time, arrival_time, price, available_seats) VALUES
  (1, 'New York', 'Boston', '2025-04-27 08:00:00', '2025-04-27 12:00:00', 45.00, 45),
  (2, 'Boston', 'Washington D.C.', '2025-04-28 09:00:00', '2025-04-28 14:00:00', 60.00, 28),
  (3, 'City C', 'Chicago', '2025-04-29 12:00:00', '2025-04-29 18:00:00', 100.00, 25),
  (4, 'New Jersey', 'Hull', '2025-04-30 09:00:00', '2025-04-30 15:00:00', 120.00, 20),
  (5, 'Washington D.C.', 'Chicago', '2025-04-29 10:00:00', '2025-04-29 18:00:00', 85.00, 35),
  (6, 'Chicago', 'Los Angeles', '2025-04-30 07:00:00', '2025-04-30 17:00:00', 120.00, 40),
  (7, 'Los Angeles', 'San Francisco', '2025-05-01 09:00:00', '2025-05-01 12:00:00', 50.00, 30),
  (8, 'San Francisco', 'Seattle', '2025-05-02 08:00:00', '2025-05-02 14:00:00', 70.00, 25);
  ```
- Note: Adjust the schema if additional tables (e.g., `user`, `booking`, `passenger`) are required. Spring Boot’s `ddl-auto=update` will create these tables based on your entities if they don’t exist.

#### 3. Build and Run the Backend
- Open the backend project in IntelliJ IDEA.
- Build the project: `Build` > `Build Project`.
- Run the application:
    - Right-click on the main application class (e.g., `BusBookingSystemApplication.java`) and select `Run`.
    - The backend will start on `http://localhost:8082`.

### Step 3: Set Up the Frontend (React)

#### 1. Navigate to the Frontend Directory
- Assuming the frontend is in a subdirectory (e.g., `frontend`), navigate to it:
  ```bash
  cd frontend
  ```

#### 2. Install Dependencies
- Install the required Node.js packages:
  ```bash
  npm install
  ```
- This will install dependencies like `axios`, `react-router-dom`, etc., assuming they’re in your `package.json`.

#### 3. Run the Frontend
- Start the React development server:
  ```bash
  npm start
  ```
- The frontend will start on `http://localhost:3000`.

### Step 4: Test the Application
- Open your browser and navigate to `http://localhost:3000`.
- Log in (if authentication is implemented), search for buses, and try booking a ticket.
- Verify that the backend API (`http://localhost:8082`) is accessible and returns data.

## API Documentation

### Base URL
- **Base URL**: `http://localhost:8082/api`

### Authentication
- All endpoints require a JWT token in the `Authorization` header as `Bearer <token>`.
- The token is stored in `localStorage` on the frontend (`localStorage.getItem('token')`).

### Endpoints

#### 1. Get All Buses
- **Endpoint**: `/api/buses`
- **Method**: GET
- **Description**: Retrieves a list of all available buses.
- **Query Parameters** (Optional):
    - `from` (string): Departure city (e.g., "New York").
    - `to` (string): Arrival city (e.g., "Boston").
- **Headers**:
    - `Authorization`: `Bearer <token>`
- **Request Example**:
  ```
  GET http://localhost:8082/api/buses
  ```
  OR with filters:
  ```
  GET http://localhost:8082/api/buses?from=New%20York&to=Boston
  ```
- **Response**:
    - **Status**: 200 OK
    - **Body**:
      ```json
      [
        {
          "id": 1,
          "fromLocation": "New York",
          "toLocation": "Boston",
          "departureTime": "2025-04-27T08:00:00",
          "arrivalTime": "2025-04-27T12:00:00",
          "price": 45.0,
          "availableSeats": 45
        },
        {
          "id": 2,
          "fromLocation": "Boston",
          "toLocation": "Washington D.C.",
          "departureTime": "2025-04-28T09:00:00",
          "arrivalTime": "2025-04-28T14:00:00",
          "price": 60.0,
          "availableSeats": 28
        }
      ]
      ```
- **Error Responses**:
    - **401 Unauthorized**: If the token is missing or invalid.
      ```json
      "Unauthorized"
      ```

#### 2. Get Bus by ID
- **Endpoint**: `/api/buses/{id}`
- **Method**: GET
- **Description**: Retrieves details of a specific bus by its ID.
- **Path Parameters**:
    - `id` (long): The ID of the bus (e.g., 1).
- **Headers**:
    - `Authorization`: `Bearer <token>`
- **Request Example**:
  ```
  GET http://localhost:8082/api/buses/1
  ```
- **Response**:
    - **Status**: 200 OK
    - **Body**:
      ```json
      {
        "id": 1,
        "fromLocation": "New York",
        "toLocation": "Boston",
        "departureTime": "2025-04-27T08:00:00",
        "arrivalTime": "2025-04-27T12:00:00",
        "price": 45.0,
        "availableSeats": 45
      }
      ```
- **Error Responses**:
    - **401 Unauthorized**: If the token is missing or invalid.
      ```json
      "Unauthorized"
      ```
    - **404 Not Found**: If the bus ID doesn’t exist.
      ```json
      "Bus not found"
      ```

#### 3. Create a Booking
- **Endpoint**: `/api/bookings`
- **Method**: POST
- **Description**: Creates a new booking for a bus.
- **Headers**:
    - `Authorization`: `Bearer <token>`
    - `Content-Type`: `application/json`
- **Request Body**:
  ```json
  {
    "busId": 1,
    "passengers": [
      {
        "name": "John Doe",
        "age": 30,
        "seatNumber": "A1"
      },
      {
        "name": "Jane Smith",
        "age": 25,
        "seatNumber": "A2"
      }
    ]
  }
  ```
- **Data Validation Rules**:
    - `busId`: Must be a valid bus ID (long, required).
    - `passengers`: Must be a non-empty array.
    - `passengers[].name`: String, required, max 100 characters.
    - `passengers[].age`: Integer, required, must be between 1 and 120.
    - `passengers[].seatNumber`: String, required, max 10 characters, must be unique within the bus’s bookings.
    - The number of passengers must not exceed the bus’s `availableSeats`.
- **Response**:
    - **Status**: 200 OK
    - **Body**:
      ```json
      {
        "id": 1,
        "user": { "id": 1, "email": "user@example.com" },
        "bus": { "id": 1, "fromLocation": "New York" },
        "bookingTime": "2025-04-26T09:00:00",
        "status": "CONFIRMED",
        "passengers": [
          { "id": 1, "name": "John Doe", "age": 30, "seatNumber": "A1" },
          { "id": 2, "name": "Jane Smith", "age": 25, "seatNumber": "A2" }
        ]
      }
      ```
- **Error Responses**:
    - **400 Bad Request**: If validation fails (e.g., duplicate seat numbers, insufficient seats).
      ```json
      "Seats A1, A2 are already booked"
      ```
      OR
      ```json
      "Not enough seats available"
      ```
    - **401 Unauthorized**: If the token is missing or invalid.
      ```json
      "Unauthorized"
      ```
    - **500 Internal Server Error**: If there’s a server-side issue.
      ```json
      "Internal server error: <details>"
      ```

#### 4. Get Booking History
- **Endpoint**: `/api/bookings/history`
- **Method**: GET
- **Description**: Retrieves the booking history for the authenticated user.
- **Headers**:
    - `Authorization`: `Bearer <token>`
- **Request Example**:
  ```
  GET http://localhost:8082/api/bookings/history
  ```
- **Response**:
    - **Status**: 200 OK
    - **Body**:
      ```json
      [
        {
          "id": 1,
          "user": { "id": 1, "email": "user@example.com" },
          "bus": { "id": 1, "fromLocation": "New York" },
          "bookingTime": "2025-04-26T09:00:00",
          "status": "CONFIRMED",
          "passengers": [
            { "id": 1, "name": "John Doe", "age": 30, "seatNumber": "A1" }
          ]
        }
      ]
      ```
- **Error Responses**:
    - **401 Unauthorized**: If the token is missing or invalid.
      ```json
      "Unauthorized"
      ```
    - **500 Internal Server Error**: If there’s a server-side issue.
      ```json
      "Internal server error: <details>"
      ```

### Data Validation Rules Summary
- **Bus**:
    - `fromLocation`, `toLocation`: String, required, max 100 characters.
    - `departureTime`, `arrivalTime`: Datetime, required, `arrivalTime` must be after `departureTime`.
    - `price`: Double, required, must be greater than 0.
    - `availableSeats`: Integer, required, must be between 0 and 100.
- **Booking**:
    - `busId`: Long, required, must reference an existing bus.
    - `passengers`: Array, required, must not be empty.
    - `passengers[].name`: String, required, max 100 characters.
    - `passengers[].age`: Integer, required, 1–120.
    - `passengers[].seatNumber`: String, required, max 10 characters, must be unique for the bus.
- **User** (assumed based on entity):
    - `email`: String, required, valid email format.

## Running the Application
1. **Backend**:
    - Start the Spring Boot application in IntelliJ IDEA.
    - Ensure it’s running on `http://localhost:8082`.
2. **Frontend**:
    - Navigate to the `frontend` directory and run:
      ```bash
      npm start
      ```
    - The React app will start on `http://localhost:3000`.
3. **Access the App**:
    - Open `http://localhost:3000` in your browser.
    - Log in (if implemented), search for buses, book tickets, and view your booking history.

## Troubleshooting
- **Database Connection Issues**:
    - Verify MySQL is running and the credentials in `application.properties` are correct.
- **CORS Issues**:
    - Ensure the `WebConfig.java` file is present in the backend to allow CORS requests from `http://localhost:3000`.
- **Authentication Errors**:
    - Ensure the JWT token is valid and included in requests. Check the login endpoint (if implemented) to obtain a token.

## Future Improvements
- Add user registration and login endpoints.
- Implement a seat selection UI in the frontend.
- Add pagination to the `/api/buses` endpoint for scalability.
- Include more robust error handling and validation messages.