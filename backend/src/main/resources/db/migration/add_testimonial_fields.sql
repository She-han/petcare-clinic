-- Migration: Add testimonial fields to appointments table
-- Date: 2025-10-04
-- Description: Adds rating and review functionality to appointments

-- Add new columns for testimonial/review data
ALTER TABLE appointments
ADD COLUMN appointment_rating INT CHECK (appointment_rating >= 1 AND appointment_rating <= 5),
ADD COLUMN doctor_rating INT CHECK (doctor_rating >= 1 AND doctor_rating <= 5),
ADD COLUMN review_comment TEXT,
ADD COLUMN review_created_at TIMESTAMP;

-- Add index for faster queries on veterinarian reviews
CREATE INDEX idx_appointments_vet_rating ON appointments(veterinarian_id, appointment_rating) WHERE appointment_rating IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN appointments.appointment_rating IS 'User rating for the appointment experience (1-5 stars)';
COMMENT ON COLUMN appointments.doctor_rating IS 'User rating for the veterinarian (1-5 stars)';
COMMENT ON COLUMN appointments.review_comment IS 'User written review/testimonial';
COMMENT ON COLUMN appointments.review_created_at IS 'Timestamp when the review was submitted';
