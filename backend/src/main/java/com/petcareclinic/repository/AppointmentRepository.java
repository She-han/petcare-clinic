package com.petcareclinic.repository;

import com.petcareclinic.model.Appointment;
import com.petcareclinic.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Find appointments by user
    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findByUserId(@Param("userId") Long userId);

    // Find appointments by veterinarian
    @Query("SELECT a FROM Appointment a WHERE a.veterinarian.id = :vetId ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findByVeterinarianId(@Param("vetId") Long vetId);

    // Find appointments by date range
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Find appointments by status - This will work now!
    @Query("SELECT a FROM Appointment a WHERE a.status = :status ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findByStatus(@Param("status") AppointmentStatus status);

    // Find today's appointments
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :today ORDER BY a.appointmentTime")
    List<Appointment> findTodayAppointments(@Param("today") LocalDate today);

    // Find upcoming appointments
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate >= :today AND a.status IN ('SCHEDULED', 'CONFIRMED') ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findUpcomingAppointments(@Param("today") LocalDate today);
}