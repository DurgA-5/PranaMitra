# 🩸 PranaMitra – Smart Blood Management System

PranaMitra is a full-stack Blood Management System developed to simplify blood donation and emergency blood request management. The platform connects blood donors, patients, blood banks, and administrators through a secure digital system, enabling faster donor matching and efficient coordination during emergencies.

The application provides role-based access for Admins, Donors, and Patients, ensuring a seamless, secure, and reliable blood donation ecosystem.

---

# 🚀 Features

## Authentication
- Secure User Registration
- User Login
- JWT Authentication
- Role-Based Authorization
- Password Encryption
- Protected Routes

---

## Donor Module

- Complete Donor Profile
- Update Availability Status
- View Matching Blood Requests
- Accept / Reject Blood Requests
- Emergency Blood Request
- My Blood Requests
- Donation History
- Lives Impacted Dashboard
- Nearby Blood Banks
- Notifications
- Settings

---

## Patient Module

- Complete Patient Profile
- Hospital Details Management
- Create Emergency Blood Requests
- Track Blood Request Status
- View Matched Donors
- Contact Assigned Donors
- Nearby Blood Banks
- Notifications
- Settings

---

## Admin Module

- Dashboard Overview
- Manage Users
- Manage Donors
- Manage Patients
- Manage Blood Requests
- Manage Blood Banks
- Contact Query Management
- Reports & Analytics
- Notifications

---

## Landing Page

- Modern Healthcare UI
- Responsive Design
- Hero Banner
- Blood Availability Search
- Services Section
- FAQ Section
- Contact Form
- About Section
- Blood Compatibility Information

---

# 🛠 Technology Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- React Icons
- Lucide Icons

## Backend

- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- REST APIs

## Database

- MySQL

## Development Tools

- Maven
- Git
- GitHub
- IntelliJ IDEA
- VS Code
- Postman

---

# 📂 Project Structure

```
PranaMitra
│
├── pranamitra-frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── layouts
│   │   ├── pages
│   │   ├── services
│   │   ├── hooks
│   │   ├── context
│   │   └── utils
│   └── package.json
│
├── pranamitra-backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   ├── config
│   ├── security
│   └── resources
│
└── README.md
```

---

# 🗄 Database Design

The system consists of the following database tables:

- Users
- Admins
- Donors
- Patients
- Blood Requests
- Matching Requests
- Donation History
- Lives Impacted
- Blood Banks
- Notifications
- Contact Queries

---

# ⚙ Database Setup

## Step 1: Create the Database

Open MySQL Workbench (or any MySQL client) and execute the following command:

```sql
CREATE DATABASE pranamitra_db;
```

---

## Step 2: Configure Database Credentials

Open:

```
pranamitra-backend/src/main/resources/application.properties
```

Update the following properties:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pranamitra_db

spring.datasource.username=YOUR_USERNAME

spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update

spring.jpa.show-sql=true
```

---

## Step 3: Run Backend

Navigate to the backend directory:

```bash
cd pranamitra-backend
```

Run:

```bash
mvn spring-boot:run
```

The backend will automatically create all required tables in the database.

Backend URL

```
http://localhost:9090
```

---

## Step 4: Run Frontend

Navigate to the frontend directory:

```bash
cd pranamitra-frontend
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# 🔄 System Workflow

1. User Registration
2. Secure Login
3. Complete Profile
4. Patient Creates Blood Request
5. Admin Reviews Request
6. Matching Donors Identified
7. Donor Accepts Request
8. Patient Contacts Donor
9. Blood Donation Completed
10. Donation History Updated
11. Notifications Sent

---

# 🔒 Security Features

- JWT Authentication
- Password Encryption
- Role-Based Authorization
- Protected API Endpoints
- Secure REST APIs
- Input Validation
- Exception Handling

---

# 📊 Project Modules

- Authentication Module
- Admin Module
- Donor Module
- Patient Module
- Blood Request Management
- Donor Matching
- Blood Bank Management
- Notification System
- Contact Query Management
- Reports & Analytics

---

# 🌟 Key Highlights

- Modern Healthcare UI
- Fully Responsive Design
- Secure Authentication
- Role-Based Access Control
- Real-Time Blood Request Management
- Donor Matching System
- Emergency Blood Request Support
- REST API Architecture
- MySQL Database Integration
- Scalable Full-Stack Architecture

---

# 🔮 Future Enhancements

- Mobile Application
- AI-Based Donor Recommendation
- Live Location Tracking
- SMS & Email Notifications
- Hospital Integration
- Government Blood Bank Integration
- Blood Inventory Management
- Advanced Analytics Dashboard
- Multi-Language Support

---

# 📌 Conclusion

PranaMitra is a smart and reliable Blood Management System that simplifies the process of blood donation and emergency blood requests. By connecting donors, patients, blood banks, and administrators through a centralized digital platform, it reduces the time required to find compatible blood donors and improves coordination during critical situations.

The platform aims to connect the right donor with the right patient at the right time, helping save lives through technology.

---

# 👨‍💻 Developer

**PAPUGANI DURGA PRASAD**

GitHub  
https://github.com/DurgA-5


# 👥 Team

This project was developed as a collaborative team project.

| Name | Role | Contribution |
|------|------|--------------|
| **Papugani Durga Prasad** | Team Lead | Project Planning, Frontend Development, UI/UX Design, Database Design, System Architecture, API Integration, Testing, Documentation, GitHub Repository Management |
| **Anudeep** | Backend Developer | Spring Boot Backend Development, REST API Development, Database Integration, Security Implementation |
| **Sadhik Shaik** | Team Member | Development Support, Testing, Implementation Support |

---

## Team Responsibilities

### Papugani Durga Prasad (Team Lead)
- Project Planning & Coordination
- Frontend Development (React.js)
- UI/UX Design
- Database Design
- System Architecture
- API Integration
- Testing & Debugging
- Project Documentation
- GitHub Repository Management

### Anudeep
- Spring Boot Backend Development
- REST API Development
- Database Integration
- Backend Logic Implementation
- Security Configuration

### Sadhik Shaik
- Development Support
- Testing
- Implementation Support

---

LinkedIn  
https://www.linkedin.com/in/durga-prasad-papugani-3a1391322/

---

## ⭐ If you found this project useful, consider giving it a Star on GitHub!
