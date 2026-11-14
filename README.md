# FixMyStreet – Community Issue Reporting and Resolution Management System

FixMyStreet is a full-featured, web-based civic issue reporting and resolution platform that connects citizens directly with municipal authorities to fix public infrastructure issues (potholes, garbage accumulation, water leakage, broken street lights, and damaged roads).

---

## 🏗️ 3 Core Application Modules

### 1. Citizen Module
- **Registration & Authentication**: Resident signup, mobile/email verification, ward selection.
- **Issue Reporting**: Categorized filing (Roads, Waste, Water, Lighting), OpenStreetMap GPS pin drop, reverse-geocoded address search, photo attachment, and voice-to-text description.
- **Dedicated Citizen Dashboard**: Real-time tracking of reported issues, digital acknowledgment receipt generation, live stage progress bar, and 1-to-5 star rating upon resolution.

### 2. Municipal Admin Module
- **Command & Decision Desk**: High-level KPI metrics (Open issues, Overdue escalations, High priority cases, Resolved count).
- **Smart Duplicate Detection**: Proximity-based spatial algorithm identifies duplicate reports filed within 60 metres, saving municipal resources.
- **Priority Scoring Engine**: Scores issues dynamically based on category severity, elapsed age, and cluster density (High, Medium, Low).
- **Hotspot GIS Monitoring**: Interactive OpenStreetMap visualization pinpointing city clusters with priority-colored markers.
- **Authority Team Assignment**: One-click dispatch to specialized municipal departments (`Zone 4 Roads`, `Sanitation Wing`, `Metro Water`, `Lighting Cell`).

### 3. Authority & Field Team Module
- **Department Work Orders**: Dedicated portal for departmental field leads and workers.
- **Field Execution Progress**: Step-by-step milestone progression (`New Assigned` ➔ `Action in Progress` ➔ `Resolved`).
- **Mandatory Resolution Proof**: Requires uploading an after-repair photo before marking any issue as resolved.
- **Interactive Before & After Viewer**: Visual side-by-side comparison slider for citizens and inspectors to confirm work quality.

---

## 🌟 Special Features
1. **Proximity-Based Duplicate Detection** (Within 60m radius).
2. **Automated Priority Scoring Engine** (Category severity + Age + Local recurrence).
3. **Hotspot GIS Clustering** (Live OpenStreetMap markers).
4. **Overdue SLA Escalation Alerts** (Flags cases open beyond the 5-day municipal SLA).
5. **Interactive Before/After Resolution Slider**.
6. **Unified Multi-Role Login Portal** with instant 1-click evaluation access.

---

## 🛠️ Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), React.js, Vite
- **Backend**: Java 17+, Spring Boot (Spring Web, Spring Data JPA, REST API)
- **Database**: MySQL 8.0+
- **Tools**: Postman, Git, GitHub, Maven

---

## 🚀 How to Run the Project Locally

### Frontend (React + Vite)
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Backend (Java Spring Boot)
1. Import `backend/database.sql` into MySQL Workbench.
2. In `backend/src/main/resources/application.properties`, update your MySQL password.
3. Start the Spring Boot backend:
```bash
cd backend
mvn spring-boot:run
```
Backend runs at [http://localhost:8080](http://localhost:8080).
