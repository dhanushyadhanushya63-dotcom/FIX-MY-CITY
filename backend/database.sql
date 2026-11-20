-- FixMyStreet MySQL Database Setup Script
-- Run this in MySQL Workbench or via command line: mysql -u root -p < database.sql

CREATE DATABASE IF NOT EXISTS fixmystreet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fixmystreet_db;

-- 1. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(20) PRIMARY KEY,
    cat VARCHAR(50) NOT NULL,
    category_label VARCHAR(100),
    description TEXT NOT NULL,
    other_details VARCHAR(255),
    area VARCHAR(255) NOT NULL,
    lat DOUBLE NOT NULL,
    lng DOUBLE NOT NULL,
    stage INT NOT NULL DEFAULT 0,
    by_citizen VARCHAR(100) NOT NULL,
    team VARCHAR(100) DEFAULT NULL,
    proof BOOLEAN DEFAULT FALSE,
    proof_img LONGTEXT DEFAULT NULL,
    rating INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Status History Table (Tracks each stage transition)
CREATE TABLE IF NOT EXISTS status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(20) NOT NULL,
    stage INT NOT NULL,
    at VARCHAR(50) NOT NULL,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

-- 3. Complaint Notes Table (Authority / Worker internal notes)
CREATE TABLE IF NOT EXISTS complaint_notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(20) NOT NULL,
    note TEXT NOT NULL,
    at VARCHAR(50) NOT NULL,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

-- 4. Feedback / Citizen Contact Table
CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    kind VARCHAR(50) NOT NULL,
    name VARCHAR(100),
    email VARCHAR(150),
    message TEXT NOT NULL,
    at VARCHAR(50) NOT NULL
);

-- Seed Initial Demo Data (FMS-101 to FMS-110)
INSERT INTO complaints (id, cat, category_label, description, area, lat, lng, stage, by_citizen, team, proof, rating)
VALUES
('FMS-101', 'pothole', 'Roads & Potholes', 'Deep pothole near the bus stop, two-wheelers swerve into traffic.', 'T. Nagar', 13.0418, 80.2341, 0, 'Priya Raman', NULL, FALSE, NULL),
('FMS-102', 'pothole', 'Roads & Potholes', 'Large pothole outside the Pondy Bazaar entrance.', 'T. Nagar', 13.04205, 80.23435, 0, 'Karthik S', NULL, FALSE, NULL),
('FMS-103', 'garbage', 'Garbage & Waste', 'Garbage heap not cleared for a week on 2nd Main Road.', 'Adyar', 13.0012, 80.2565, 2, 'Priya Raman', 'Sanitation Wing', FALSE, NULL),
('FMS-104', 'leakage', 'Water Supply', 'Drinking water pipe leaking onto the road.', 'Velachery', 12.9815, 80.2180, 3, 'Meena L', 'Metro Water', FALSE, NULL),
('FMS-105', 'light', 'Street Lights', 'Three streetlights are out along the service road.', 'Guindy', 13.0067, 80.2206, 1, 'Priya Raman', NULL, FALSE, NULL),
('FMS-106', 'pothole', 'Roads & Potholes', 'Road caved in after rain near the signal.', 'Anna Nagar', 13.0850, 80.2101, 2, 'Arun V', 'Zone 4 Roads', FALSE, NULL),
('FMS-107', 'garbage', 'Garbage & Waste', 'Overflowing bins near the vegetable market.', 'Mylapore', 13.0368, 80.2676, 4, 'Priya Raman', 'Sanitation Wing', TRUE, NULL),
('FMS-108', 'leakage', 'Water Supply', 'Sewage overflowing into the lane.', 'Perambur', 13.1167, 80.2333, 0, 'Divya R', NULL, FALSE, NULL),
('FMS-109', 'pothole', 'Roads & Potholes', 'Broken tar patch where the highway merges.', 'Tambaram', 12.9249, 80.1000, 3, 'Priya Raman', 'Zone 4 Roads', FALSE, NULL),
('FMS-110', 'light', 'Street Lights', 'Dark stretch outside the school gate.', 'Velachery', 12.9790, 80.2210, 5, 'Priya Raman', 'Lighting Cell', TRUE, 4)
ON DUPLICATE KEY UPDATE id=id;

-- Initial status history for seeds
INSERT INTO status_history (complaint_id, stage, at)
VALUES
('FMS-101', 0, '2026-11-17T09:00:00.000Z'),
('FMS-102', 0, '2026-11-15T10:30:00.000Z'),
('FMS-103', 0, '2026-11-12T08:00:00.000Z'),
('FMS-103', 1, '2026-11-13T09:00:00.000Z'),
('FMS-103', 2, '2026-11-14T11:00:00.000Z'),
('FMS-104', 0, '2026-11-14T09:00:00.000Z'),
('FMS-104', 1, '2026-11-15T10:00:00.000Z'),
('FMS-104', 2, '2026-11-16T12:00:00.000Z'),
('FMS-104', 3, '2026-11-17T14:00:00.000Z'),
('FMS-105', 0, '2026-11-16T18:00:00.000Z'),
('FMS-105', 1, '2026-11-17T09:00:00.000Z'),
('FMS-106', 0, '2026-11-16T07:30:00.000Z'),
('FMS-106', 1, '2026-11-16T11:00:00.000Z'),
('FMS-106', 2, '2026-11-17T10:00:00.000Z'),
('FMS-107', 0, '2026-11-10T08:00:00.000Z'),
('FMS-107', 1, '2026-11-11T09:00:00.000Z'),
('FMS-107', 2, '2026-11-12T10:00:00.000Z'),
('FMS-107', 3, '2026-11-13T14:00:00.000Z'),
('FMS-107', 4, '2026-11-15T16:00:00.000Z'),
('FMS-108', 0, '2026-11-11T12:00:00.000Z'),
('FMS-109', 0, '2026-11-15T08:00:00.000Z'),
('FMS-109', 1, '2026-11-15T15:00:00.000Z'),
('FMS-109', 2, '2026-11-16T10:00:00.000Z'),
('FMS-109', 3, '2026-11-17T11:00:00.000Z'),
('FMS-110', 0, '2026-11-08T09:00:00.000Z'),
('FMS-110', 1, '2026-11-09T10:00:00.000Z'),
('FMS-110', 2, '2026-11-10T12:00:00.000Z'),
('FMS-110', 3, '2026-11-11T14:00:00.000Z'),
('FMS-110', 4, '2026-11-13T16:00:00.000Z'),
('FMS-110', 5, '2026-11-14T17:00:00.000Z');


-- 5. Users / Authentication Table (Supports Citizen, Admin, Authority roles)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role ENUM('citizen', 'admin', 'authority') NOT NULL,
    email VARCHAR(150),
    contact VARCHAR(50),
    team VARCHAR(100) DEFAULT NULL,
    area VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pre-seeded accounts for evaluation & demo testing
INSERT INTO users (id, name, role, email, contact, team, area)
VALUES
('CIT-2026-44', 'Priya Raman', 'citizen', 'priya.raman@example.com', '9840123456', NULL, 'T. Nagar, Chennai'),
('CIT-2026-45', 'Karthik S', 'citizen', 'karthik.s@example.com', '9840198765', NULL, 'Adyar, Chennai'),
('ADM-01', 'Municipal Admin Desk', 'admin', 'admin@fixmystreet.gov', '044-2561913', NULL, 'Greater Chennai Corporation'),
('AUTH-Z4-ROADS', 'Officer R. Selvam', 'authority', 'roads.zone4@fixmystreet.gov', '044-2815000', 'Zone 4 Roads', 'Zone 4'),
('AUTH-SANITATION', 'Lead Inspector Murugan', 'authority', 'sanitation@fixmystreet.gov', '044-2815001', 'Sanitation Wing', 'Central Division'),
('AUTH-METRO-WATER', 'Engineer K. Anitha', 'authority', 'water@fixmystreet.gov', '044-2815002', 'Metro Water', 'Chennai Metro'),
('AUTH-LIGHTING', 'Supervisor S. Baskar', 'authority', 'lighting@fixmystreet.gov', '044-2815003', 'Lighting Cell', 'Street Lighting Division')
ON DUPLICATE KEY UPDATE id=id;
