package com.donation.entity;

public enum RequestStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    CANCELLED // set when the donor cancels the underlying donation while this request was still pending
}