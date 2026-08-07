package com.donation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "volunteer_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VolunteerDetails {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "vehicle_type", length = 50)
    private String vehicleType;

    @Builder.Default
    private Boolean availability = true;

    @Column(name = "total_deliveries")
    @Builder.Default
    private Integer totalDeliveries = 0;
}
