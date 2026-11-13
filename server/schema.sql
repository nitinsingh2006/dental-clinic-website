CREATE DATABASE IF NOT EXISTS dental_clinic;

USE dental_clinic;

CREATE TABLE IF NOT EXISTS appointments (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  patient_name     VARCHAR(100)  NOT NULL,
  phone            VARCHAR(15)   NOT NULL,
  doctor           VARCHAR(100)  NOT NULL,
  appointment_date DATE          NOT NULL,
  time_slot        VARCHAR(20)   NOT NULL,
  status           ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
