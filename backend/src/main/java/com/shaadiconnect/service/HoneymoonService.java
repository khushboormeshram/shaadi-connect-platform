package com.shaadiconnect.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shaadiconnect.dto.HoneymoonDtos;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class HoneymoonService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String apiUrl;

    public HoneymoonService(ObjectMapper objectMapper,
            @Value("${app.gemini.api-key:}") String apiKey,
            @Value("${app.gemini.api-url}") String apiUrl) {
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
    }

    public HoneymoonDtos.HoneymoonResponse planHoneymoon(HoneymoonDtos.HoneymoonRequest request) {
        try {
            if (apiKey != null && !apiKey.isBlank()) {
                String prompt = buildPrompt(request);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<String> entity = new HttpEntity<>(
                        objectMapper.writeValueAsString(buildGeminiPayload(prompt)), headers);

                ResponseEntity<JsonNode> responseEntity = restTemplate.exchange(apiUrl + "?key=" + apiKey,
                        HttpMethod.POST, entity, JsonNode.class);
                JsonNode response = responseEntity.getBody();
                if (response != null) {
                    JsonNode textNode = response.path("candidates").path(0).path("content").path("parts").path(0)
                            .path("text");
                    if (!textNode.isMissingNode() && !textNode.asText().isBlank()) {
                        String cleaned = textNode.asText().replace("```json", "").replace("```", "").trim();
                        return objectMapper.readValue(cleaned, HoneymoonDtos.HoneymoonResponse.class);
                    }
                }
            }
        } catch (RestClientException | IllegalArgumentException ex) {
            // Use mock data below.
        } catch (Exception ex) {
            // Use mock data below.
        }

        return mockResponse(request);
    }

    private String buildPrompt(HoneymoonDtos.HoneymoonRequest request) {
        return "Plan a romantic honeymoon itinerary for a couple traveling from " + request.origin() +
                " to " + request.destination() + " for " + request.duration() +
                " days with a budget of $" + request.budget() +
                ". Return valid JSON with flights, hotels, packages, and itinerary arrays.";
    }

    private Object buildGeminiPayload(String prompt) {
        return java.util.Map.of("contents",
                List.of(java.util.Map.of("parts", List.of(java.util.Map.of("text", prompt)))));
    }

    private HoneymoonDtos.HoneymoonResponse mockResponse(HoneymoonDtos.HoneymoonRequest request) {
        List<HoneymoonDtos.FlightOption> flights = List.of(
                new HoneymoonDtos.FlightOption("Air India", 1200, "20 hours", "1", 3.8),
                new HoneymoonDtos.FlightOption("Emirates", 1500, "18 hours", "1", 4.2),
                new HoneymoonDtos.FlightOption("Delta", 1800, "22 hours", "1", 4.0));

        List<HoneymoonDtos.HotelOption> hotels = List.of(
                new HoneymoonDtos.HotelOption("The Taj Mahal Palace", 4.8, 350,
                        "Iconic luxury hotel with stunning views."),
                new HoneymoonDtos.HotelOption("The Oberoi, Mumbai", 4.7, 300,
                        "Elegant hotel offering exceptional service."),
                new HoneymoonDtos.HotelOption("St. Regis Mumbai", 4.6, 250,
                        "Luxurious hotel with a sophisticated ambiance."));

        List<HoneymoonDtos.PackageOption> packages = List.of(
                new HoneymoonDtos.PackageOption("Romantic Mumbai Getaway", 1000, "3 days",
                        "Private car transfers, spa treatment, dinner cruise."),
                new HoneymoonDtos.PackageOption("Mumbai Culture & Cuisine Tour", 700, "4 days",
                        "Historical sites, cooking class, street food tour."),
                new HoneymoonDtos.PackageOption("Luxury Mumbai Experience", 1500, "5 days",
                        "Luxury hotel stay, private yacht tour, personal shopper."));

        List<HoneymoonDtos.ItineraryDay> itineraryDays = new ArrayList<>();
        for (int day = 1; day <= request.duration(); day++) {
            itineraryDays.add(new HoneymoonDtos.ItineraryDay("Day " + day, "Explore " + request.destination(),
                    "Romantic activity tailored to the city's culture and a special dinner."));
        }

        return new HoneymoonDtos.HoneymoonResponse(flights, hotels, packages,
                new HoneymoonDtos.HoneymoonItinerary(itineraryDays));
    }
}
