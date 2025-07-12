package com.petcareclinic.service;

import com.petcareclinic.model.Appointment;
import com.petcareclinic.repository.AppointmentRepository;
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
}