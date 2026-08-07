package com.donation.dto;

import com.donation.entity.DeliveryStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateDeliveryStatusDto {

    @NotNull
    private DeliveryStatus status; // PICKED_UP, IN_TRANSIT, or DELIVERED
}
