package com.shaadiconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public final class HoneymoonDtos {
    private HoneymoonDtos() {
    }

    public record HoneymoonRequest(@NotBlank String destination, @NotBlank String budget, @NotNull Integer duration,
            @NotBlank String origin) {
    }

    public record HoneymoonResponse(List<FlightOption> flights, List<HotelOption> hotels, List<PackageOption> packages,
            HoneymoonItinerary itinerary) {
    }

    public record FlightOption(String airline, Number price, String duration, Object stops, Double rating) {
    }

    public record HotelOption(String hotelName, Double rating, Number pricePerNight, String description) {
    }

    public record PackageOption(String name, Number price, String duration, String includes) {
    }

    public record HoneymoonItinerary(List<ItineraryDay> honeymoonItinerary) {
    }

    public record ItineraryDay(String day, String activity, String description) {
    }
}
