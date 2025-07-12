package com.petcareclinic.repository;

import com.petcareclinic.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByVeterinarianId(Long veterinarianId);

    List<Appointment> findByUserId(Long userId); // Get appointments by user

    List<Appointment> findByClientEmail(String clientEmail);

    List<Appointment> findByAppointmentDate(LocalDate appointmentDate);

    List<Appointment> findByStatus(String status);

    @Query("SELECT a FROM Appointment a WHERE a.veterinarianId = :veterinarianId AND a.appointmentDate = :date")
    List<Appointment> findByVeterinarianAndDate(@Param("veterinarianId") Long veterinarianId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.veterinarianId = :veterinarianId AND a.appointmentDate = :date AND a.appointmentTime = :time")
    List<Appointment> findByVeterinarianDateAndTime(@Param("veterinarianId") Long veterinarianId, @Param("date") LocalDate date, @Param("time") LocalTime time);

    @Query("SELECT a FROM Appointment a WHERE a.userId = :userId ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findByUserIdOrderByDateTimeDesc(@Param("userId") Long userId);
}