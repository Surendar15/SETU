package com.donation.entity;

public enum DonationStatus {
    AVAILABLE,   // posted by donor, open for requests
    REQUESTED,   // an orphanage has requested it
    ASSIGNED,    // a volunteer has been assigned for pickup
    PICKED_UP,   // volunteer has collected it from donor
    DELIVERED,   // volunteer has delivered it to orphanage
    CANCELLED
}
