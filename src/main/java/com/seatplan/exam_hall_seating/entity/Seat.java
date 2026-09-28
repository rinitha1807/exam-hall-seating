package com.seatplan.exam_hall_seating.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "seats")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seatNumber;

    @Column(name = "seat_row")
    private int rowNumber;

    @Column(name = "seat_column")
    private int columnNumber;

    @ManyToOne
    @JoinColumn(name = "hall_id")
    @JsonIgnoreProperties("seats")
    private Hall hall;


    // Default constructor
    public Seat() {
    }


    // Get ID
    public Long getId() {
        return id;
    }


    // Get seat number
    public String getSeatNumber() {
        return seatNumber;
    }


    // Set seat number
    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }


    // Get row number
    public int getRowNumber() {
        return rowNumber;
    }


    // Set row number
    public void setRowNumber(int rowNumber) {
        this.rowNumber = rowNumber;
    }


    // Get column number
    public int getColumnNumber() {
        return columnNumber;
    }


    // Set column number
    public void setColumnNumber(int columnNumber) {
        this.columnNumber = columnNumber;
    }


    // Get hall
    public Hall getHall() {
        return hall;
    }


    // Set hall
    public void setHall(Hall hall) {
        this.hall = hall;
    }
}