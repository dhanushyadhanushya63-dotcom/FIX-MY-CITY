# FixMyStreet Java Spring Boot + MySQL Backend

## Tech Stack
- **Language**: Java 17+
- **Framework**: Spring Boot 3.2.5 (Spring Web, Spring Data JPA)
- **Database**: MySQL 8.0+
- **ORM**: Hibernate

---

## 1. Database Setup (MySQL)

Make sure MySQL Server is running. In MySQL Workbench or Command Prompt, execute:

```sql
source d:/FixMyStreet-Update/backend/database.sql
```
Or open `database.sql` inside MySQL Workbench and click **Execute (⚡)**.

This creates the database `fixmystreet_db` with all tables (`complaints`, `status_history`, `complaint_notes`, `feedback`) and initial demo complaints.

---

## 2. Configure Database Credentials

Open `src/main/resources/application.properties` and verify your MySQL password:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fixmystreet_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

## 3. Run the Backend Server

From the `backend` folder, run:

```powershell
# Using installed Maven:
mvn spring-boot:run
```

Or run `FixMyStreetApplication.java` inside VS Code (with Java Extension Pack) or IntelliJ IDEA.

The backend API will start at:
👉 **`http://localhost:8080`**

---

## 4. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/complaints` | Fetch all complaints for Home, Map & Admin |
| `GET` | `/api/complaints/{id}` | Fetch single complaint with timeline & notes |
| `POST` | `/api/complaints` | Register a new complaint |
| `PUT` | `/api/complaints/{id}/stage` | Update complaint status, assign team, attach proof/rating |
| `POST` | `/api/complaints/{id}/notes` | Add progress note from field worker |
| `POST` | `/api/feedback` | Submit citizen contact message or suggestion |
| `GET` | `/api/feedback` | Fetch all feedback |
| `GET` | `/api/users` | List all users or filter by role (`?role=citizen`) |
| `GET` | `/api/users/{id}` | Fetch user details by ID |
| `POST` | `/api/users/register` | Register new citizen/worker |
| `POST` | `/api/users/login` | Citizen / Admin / Authority login verification |
