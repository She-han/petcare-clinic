package com.petcareclinic.service;

import com.petcareclinic.model.Appointment;
import com.petcareclinic.model.Testimonial;
import com.petcareclinic.model.User;
import com.petcareclinic.repository.AppointmentRepository;
import com.petcareclinic.repository.TestimonialRepository;
import com.petcareclinic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private TestimonialRepository testimonialRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment createAppointment(Appointment appointment) {
        try {
            // Set timestamps
            appointment.setCreatedAt(LocalDateTime.now());
            appointment.setUpdatedAt(LocalDateTime.now());

            // Set default status if not provided
            if (appointment.getStatus() == null) {
                appointment.setStatus("SCHEDULED");
            }

            return appointmentRepository.save(appointment);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create appointment: " + e.getMessage());
        }
    }

    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        try {
            Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
            if (optionalAppointment.isPresent()) {
                Appointment appointment = optionalAppointment.get();

                // Update fields
                appointment.setVeterinarianId(appointmentDetails.getVeterinarianId());
                appointment.setUserId(appointmentDetails.getUserId());
                appointment.setClientName(appointmentDetails.getClientName());
                appointment.setClientEmail(appointmentDetails.getClientEmail());
                appointment.setClientPhone(appointmentDetails.getClientPhone());
                appointment.setPetName(appointmentDetails.getPetName());
                appointment.setPetType(appointmentDetails.getPetType());
                appointment.setPetAge(appointmentDetails.getPetAge());
                appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
                appointment.setAppointmentTime(appointmentDetails.getAppointmentTime());
                appointment.setReasonForVisit(appointmentDetails.getReasonForVisit());
                appointment.setAdditionalNotes(appointmentDetails.getAdditionalNotes());
                appointment.setStatus(appointmentDetails.getStatus());

                // Update timestamp
                appointment.setUpdatedAt(LocalDateTime.now());

                return appointmentRepository.save(appointment);
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to update appointment: " + e.getMessage());
        }
    }

    public boolean deleteAppointment(Long id) {
        try {
            if (appointmentRepository.existsById(id)) {
                appointmentRepository.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Appointment> getAppointmentsByVeterinarian(Long veterinarianId) {
        return appointmentRepository.findByVeterinarianId(veterinarianId);
    }

    public List<Appointment> getAppointmentsByUser(Long userId) {
        return appointmentRepository.findByUserIdOrderByDateTimeDesc(userId);
    }

    public List<Appointment> getAppointmentsByClient(String clientEmail) {
        return appointmentRepository.findByClientEmail(clientEmail);
    }

    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    public boolean isTimeSlotAvailable(Long veterinarianId, LocalDate date, LocalTime time) {
        List<Appointment> existingAppointments = appointmentRepository.findByVeterinarianDateAndTime(veterinarianId, date, time);
        return existingAppointments.isEmpty();
    }

    // Add testimonial/review to appointment and create testimonial entry
    public Appointment addTestimonial(Long appointmentId, Integer appointmentRating, Integer doctorRating, String reviewComment) {
        try {
            Optional<Appointment> optionalAppointment = appointmentRepository.findById(appointmentId);
            if (optionalAppointment.isPresent()) {
                Appointment appointment = optionalAppointment.get();
                
                // Update appointment with ratings
                appointment.setAppointmentRating(appointmentRating);
                appointment.setDoctorRating(doctorRating);
                appointment.setReviewComment(reviewComment);
                appointment.setReviewCreatedAt(LocalDateTime.now());
                appointment.setUpdatedAt(LocalDateTime.now());

                Appointment savedAppointment = appointmentRepository.save(appointment);

                // Create testimonial entry in testimonials table
                Testimonial testimonial = new Testimonial();
                testimonial.setCustomerName(appointment.getClientName());
                testimonial.setCustomerEmail(appointment.getClientEmail());
                testimonial.setRating(doctorRating); // Use doctor rating as main rating
                testimonial.setContent(reviewComment);
                testimonial.setPetName(appointment.getPetName());
                testimonial.setPetType(appointment.getPetType());
                testimonial.setServiceType(appointment.getReasonForVisit());
                testimonial.setIsApproved(false); // Needs admin approval
                testimonial.setIsFeatured(false);
                testimonial.setCreatedAt(LocalDateTime.now());
                testimonial.setUpdatedAt(LocalDateTime.now());

                // Link to user if available
                if (appointment.getUserId() != null) {
                    Optional<User> user = userRepository.findById(appointment.getUserId());
                    user.ifPresent(testimonial::setUser);
                }

                testimonialRepository.save(testimonial);

                return savedAppointment;
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to add testimonial: " + e.getMessage());
        }
    }

    // Get appointments with reviews for a specific veterinarian
    public List<Appointment> getAppointmentsWithReviewsByVeterinarian(Long veterinarianId) {
        return appointmentRepository.findByVeterinarianId(veterinarianId).stream()
            .filter(appointment -> appointment.getAppointmentRating() != null)
            .toList();
    }
}