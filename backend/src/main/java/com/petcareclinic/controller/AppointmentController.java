package com.petcareclinic.controller;

import com.petcareclinic.model.Appointment;
import com.petcareclinic.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // Get all appointments
    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        try {
            List<Appointment> appointments = appointmentService.getAllAppointments();
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            System.err.println("Error getting appointments: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get appointment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        try {
            Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
            if (appointment.isPresent()) {
                return ResponseEntity.ok(appointment.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error getting appointment by ID: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create new appointment
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        try {
            System.out.println("Creating appointment for: " + appointment.getClientName());
            System.out.println("User ID: " + appointment.getUserId());
            System.out.println("Veterinarian ID: " + appointment.getVeterinarianId());
            System.out.println("Appointment Date: " + appointment.getAppointmentDate());
            System.out.println("Appointment Time: " + appointment.getAppointmentTime());

            // Check if time slot is available
            boolean isAvailable = appointmentService.isTimeSlotAvailable(
                    appointment.getVeterinarianId(),
                    appointment.getAppointmentDate(),
                    appointment.getAppointmentTime()
            );

            if (!isAvailable) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build(); // Time slot taken
            }

            Appointment createdAppointment = appointmentService.createAppointment(appointment);
            System.out.println("Appointment created successfully with ID: " + createdAppointment.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(createdAppointment);
        } catch (Exception e) {
            System.err.println("Error creating appointment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Get appointments by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByUser(@PathVariable Long userId) {
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByUser(userId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            System.err.println("Error getting appointments by user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get appointments by veterinarian
    @GetMapping("/veterinarian/{veterinarianId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByVeterinarian(@PathVariable Long veterinarianId) {
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByVeterinarian(veterinarianId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            System.err.println("Error getting appointments by veterinarian: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Check time slot availability
    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> checkTimeSlotAvailability(
            @RequestParam Long veterinarianId,
            @RequestParam String date,
            @RequestParam String time) {
        try {
            LocalDate appointmentDate = LocalDate.parse(date);
            LocalTime appointmentTime = LocalTime.parse(time);

            boolean isAvailable = appointmentService.isTimeSlotAvailable(veterinarianId, appointmentDate, appointmentTime);
            return ResponseEntity.ok(isAvailable);
        } catch (Exception e) {
            System.err.println("Error checking availability: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update appointment
    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointmentDetails) {
        try {
            Appointment updatedAppointment = appointmentService.updateAppointment(id, appointmentDetails);
            if (updatedAppointment != null) {
                return ResponseEntity.ok(updatedAppointment);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error updating appointment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Delete appointment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        try {
            boolean deleted = appointmentService.deleteAppointment(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error deleting appointment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}