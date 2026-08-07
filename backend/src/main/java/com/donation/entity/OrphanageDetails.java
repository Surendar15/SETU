package com.donation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orphanage_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrphanageDetails {

    @Id
    @Column(name = "user_id")
    private Long userId;

    // Shares the same primary key as the User row it belongs to
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "registration_number", length = 100)
    private String registrationNumber;

    private Integer capacity;

    @Column(name = "document_url", length = 255)
    private String documentUrl; // proof/verification document
}
