"use client";

import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import AddressMapWrapper from "../AddressMapWrapper";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { MapPin, Building, DollarSign, Plus, Trash2 } from "lucide-react";

// Type definitions
type AvailableHour = {
  day: string;
  slots: Array<{ start: string; end: string }>;
};

type TimeSlot = {
  start: string;
  end: string;
};

type AddressErrors = {
  streetAddress?: { message?: string };
  city?: { message?: string };
  state?: { message?: string };
  postalCode?: { message?: string };
  country?: { message?: string };
};

interface AddressDetails {
  road?: string;
  street?: string;
  houseNumber?: string;
  suburb?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  [key: string]: string | undefined;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIME_SLOTS = Array.from({ length: 24 * 2 }).map((_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${ampm}`;
});

const PracticeDetailsStep = () => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useFormContext();

  const { fields: availableHoursFields } = useFieldArray({
    control,
    name: "availableHours",
  });

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Watch for address field changes to update map
  const addressFields = watch([
    "address.streetAddress",
    "address.city",
    "address.state",
    "address.postalCode",
    "address.country",
  ]);

  // Track current search query
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [isManuallyUpdating, setIsManuallyUpdating] = useState(false);

  // Update search query when address fields change
  useEffect(() => {
    // Skip this effect if the update was from the map selection
    if (isManuallyUpdating) {
      return;
    }

    const streetAddress = getValues("address.streetAddress");
    const city = getValues("address.city");

    // Only create a search query if we have at least a city
    if (city) {
      const parts = [];
      if (streetAddress) parts.push(streetAddress);
      parts.push(city);

      const state = getValues("address.state");
      const postalCode = getValues("address.postalCode");
      const country = getValues("address.country");

      if (state) parts.push(state);
      if (postalCode) parts.push(postalCode);
      if (country) parts.push(country);

      const query = parts.join(", ");
      console.log("Updated search query from form fields:", query);
      setSearchQuery(query);
    }
  }, [addressFields, getValues, isManuallyUpdating]);

  // Get user's current location when component mounts
  useEffect(() => {
    // Only try to get location if we don't already have an address
    if (
      !getValues("address.streetAddress") &&
      !getValues("address.city") &&
      !userLocation
    ) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setIsMapLoaded(true);
          },
          (error) => {
            console.error("Error getting location:", error);
            // Default location if geolocation fails
            setUserLocation({ lat: 51.505, lng: -0.09 });
            setIsMapLoaded(true);
          }
        );
      } else {
        // Default location if geolocation not supported
        setUserLocation({ lat: 51.505, lng: -0.09 });
        setIsMapLoaded(true);
      }
    } else {
      setIsMapLoaded(true);
    }
  }, [getValues, userLocation]);

  // Initialize available hours if not already set
  useEffect(() => {
    if (
      !getValues("availableHours") ||
      getValues("availableHours").length === 0
    ) {
      const initialAvailableHours = DAYS_OF_WEEK.map((day) => ({
        day,
        slots:
          day !== "Saturday" && day !== "Sunday"
            ? [{ start: "09:00 AM", end: "05:00 PM" }]
            : [],
      }));

      setValue("availableHours", initialAvailableHours, {
        shouldValidate: true,
      });
    }
  }, [setValue, getValues]);

  // Handle map address selection
  const handleAddressSelect = (data: {
    coordinates: { lat: number; lng: number };
    address: string;
    details?: AddressDetails;
  }) => {
    const { coordinates, address, details } = data;
    console.log("🌍 Selected address from map:", address);
    console.log("📍 Coordinates:", coordinates);
    console.log("📋 Address details:", details);

    try {
      // Prevent the effect from running when we update from map selection
      setIsManuallyUpdating(true);

      // If we have detailed address components from the geocoder
      if (details && Object.keys(details).length > 0) {
        // Format street address
        let streetAddress = "";
        if (details.houseNumber && details.road) {
          streetAddress = `${details.houseNumber} ${details.road}`;
        } else if (details.road) {
          streetAddress = details.road;
        } else if (details.street) {
          streetAddress = details.street;
        }

        // Get city
        const city = details.city || details.town || details.village || "";

        // Get state
        const state = details.state || "";

        // Get postal code
        const postalCode = details.postcode || "";

        // Get country
        const country = details.country || "";

        console.log("✅ Setting form values with:", {
          streetAddress,
          city,
          state,
          postalCode,
          country,
        });

        // Update form with address components
        setValue("address.streetAddress", streetAddress, {
          shouldValidate: true,
        });
        setValue("address.city", city, { shouldValidate: true });
        setValue("address.state", state, { shouldValidate: true });
        setValue("address.postalCode", postalCode, { shouldValidate: true });
        setValue("address.country", country, { shouldValidate: true });
        setValue("address.location", coordinates, { shouldValidate: true });

        // Reset the flag after a short delay
        setTimeout(() => {
          setIsManuallyUpdating(false);

          console.log("🔍 Current form values after update:", {
            streetAddress: getValues("address.streetAddress"),
            city: getValues("address.city"),
            state: getValues("address.state"),
            postalCode: getValues("address.postalCode"),
            country: getValues("address.country"),
          });
        }, 500);
      } else {
        // Fallback to parsing the address string
        const parts = address.split(",").map((part) => part.trim());

        // Extract address components
        let streetAddress = "";
        let city = "";
        let state = "";
        let postalCode = "";
        let country = "";

        // Parse based on number of components returned
        if (parts.length >= 1) {
          streetAddress = parts[0];
        }

        if (parts.length >= 2) {
          city = parts[1];
        }

        if (parts.length >= 3) {
          // Try to extract state and postal code from third part
          const statePostal = parts[2];
          if (statePostal) {
            const statePostalParts = statePostal.split(/\s+/);
            if (statePostalParts.length > 1) {
              // If multiple words, first is likely state and rest is postal code
              state = statePostalParts[0];
              postalCode = statePostalParts.slice(1).join(" ");
            } else {
              // If just one word, it's probably the state
              state = statePostal;
            }
          }
        }

        if (parts.length >= 4) {
          // If we have a fourth part and we didn't get a postal code yet, try to parse it
          if (!postalCode) {
            const fourthPart = parts[3];
            // Check if it looks like a postal code (has numbers)
            if (fourthPart && /\d/.test(fourthPart)) {
              postalCode = fourthPart;
            } else {
              // Otherwise treat it as part of country
              country = fourthPart;
            }
          } else {
            country = parts[3];
          }
        }

        // If we still don't have a country, use the last part
        if (!country && parts.length > 0) {
          country = parts[parts.length - 1];
        }

        console.log("Parsed address components:", {
          streetAddress,
          city,
          state,
          postalCode,
          country,
        });

        // Update form with parsed address data
        setValue("address.streetAddress", streetAddress, {
          shouldValidate: true,
        });
        setValue("address.city", city, { shouldValidate: true });
        setValue("address.state", state, { shouldValidate: true });
        setValue("address.postalCode", postalCode, { shouldValidate: true });
        setValue("address.country", country, { shouldValidate: true });
        setValue("address.location", coordinates, { shouldValidate: true });

        // Reset the flag after a short delay
        setTimeout(() => {
          setIsManuallyUpdating(false);

          console.log("🔍 Current form values after fallback update:", {
            streetAddress: getValues("address.streetAddress"),
            city: getValues("address.city"),
            state: getValues("address.state"),
            postalCode: getValues("address.postalCode"),
            country: getValues("address.country"),
          });
        }, 500);
      }
    } catch (error) {
      console.error("Error parsing address:", error);
      // In case of parsing error, just set the full address as street address
      setValue("address.streetAddress", address, { shouldValidate: true });
      setValue("address.location", coordinates, { shouldValidate: true });

      // Always reset the flag
      setTimeout(() => {
        setIsManuallyUpdating(false);
      }, 500);
    }
  };

  // Add a new time slot for a specific day
  const addTimeSlot = (dayIndex: number) => {
    const currentHours = [...getValues("availableHours")] as AvailableHour[];
    const currentDay = currentHours[dayIndex];

    if (!currentDay.slots) {
      currentDay.slots = [];
    }

    // Default new slot
    currentDay.slots.push({ start: "09:00 AM", end: "05:00 PM" });
    setValue(`availableHours`, currentHours, { shouldValidate: true });
  };

  // Remove a time slot
  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const currentHours = [...getValues("availableHours")] as AvailableHour[];
    if (currentHours[dayIndex].slots) {
      currentHours[dayIndex].slots = currentHours[dayIndex].slots.filter(
        (_, i: number) => i !== slotIndex
      );
      setValue(`availableHours`, currentHours, { shouldValidate: true });
    }
  };

  // Safely access address errors
  const getAddressError = (field: keyof AddressErrors) => {
    const addressErrors = errors.address as AddressErrors | undefined;
    return addressErrors?.[field]?.message;
  };

  // Geocode address based on form fields if coordinates are not already set
  const geocodeAddress = async (): Promise<boolean> => {
    // Check if we already have coordinates
    const currentLocation = getValues("address.location");
    if (currentLocation?.lat && currentLocation?.lng) {
      console.log("✅ Coordinates already set:", currentLocation);
      return true;
    }

    // Get current address values
    const streetAddress = getValues("address.streetAddress");
    const city = getValues("address.city");
    const state = getValues("address.state");
    const postalCode = getValues("address.postalCode");
    const country = getValues("address.country");

    // Need at least city to geocode
    if (!city) {
      console.log("❌ Cannot geocode without city");
      return false;
    }

    // Build search query
    const parts = [];
    if (streetAddress) parts.push(streetAddress);
    parts.push(city);
    if (state) parts.push(state);
    if (postalCode) parts.push(postalCode);
    if (country) parts.push(country);

    const query = parts.join(", ");
    console.log("🔍 Geocoding address:", query);

    try {
      // Use Nominatim API for geocoding
      const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=1&addressdetails=1`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        if (!isNaN(lat) && !isNaN(lng)) {
          console.log("✅ Found coordinates:", { lat, lng });
          setValue("address.location", { lat, lng }, { shouldValidate: true });
          return true;
        }
      }

      console.log("⚠️ No coordinates found for address");
      return false;
    } catch (error) {
      console.error("Error geocoding address:", error);
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        label="Practice Name"
        error={errors.practiceName?.message as string}
      >
        <div className="relative">
          <Building
            size={18}
            className="absolute top-3.5 left-3 text-gray-500"
          />
          <Input
            placeholder="Enter your practice or clinic name"
            className="pl-10"
            error={!!errors.practiceName}
            {...register("practiceName")}
          />
        </div>
      </FormField>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Practice Location
        </label>
        {isMapLoaded && (
          <AddressMapWrapper
            onAddressSelect={handleAddressSelect}
            initialCoordinates={userLocation || { lat: 51.505, lng: -0.09 }}
            searchQuery={searchQuery}
          />
        )}

        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
          <FormField
            label="Street Address"
            error={getAddressError("streetAddress")}
          >
            <div className="relative">
              <MapPin
                size={18}
                className="absolute top-3.5 left-3 text-gray-500"
              />
              <Input
                placeholder="Street address"
                className="pl-10"
                error={!!getAddressError("streetAddress")}
                {...register("address.streetAddress")}
              />
            </div>
          </FormField>

          <FormField label="City" error={getAddressError("city")}>
            <Input
              placeholder="City"
              error={!!getAddressError("city")}
              {...register("address.city")}
            />
          </FormField>

          <FormField label="State/Province" error={getAddressError("state")}>
            <Input
              placeholder="State/Province"
              error={!!getAddressError("state")}
              {...register("address.state")}
            />
          </FormField>

          <FormField label="Postal Code" error={getAddressError("postalCode")}>
            <Input
              placeholder="Postal Code"
              error={!!getAddressError("postalCode")}
              {...register("address.postalCode")}
              maxLength={50}
              minLength={1}
            />
          </FormField>

          <FormField label="Country" error={getAddressError("country")}>
            <Input
              placeholder="Country"
              error={!!getAddressError("country")}
              {...register("address.country")}
            />
          </FormField>
        </div>
      </div>

      <FormField
        label="Consultation Fee"
        error={errors.consultationFee?.message as string}
      >
        <div className="relative">
          <DollarSign
            size={18}
            className="absolute top-3.5 left-3 text-gray-500"
          />
          <Input
            type="number"
            placeholder="Enter fee amount"
            className="pl-10"
            error={!!errors.consultationFee}
            {...register("consultationFee", { valueAsNumber: true })}
          />
        </div>
      </FormField>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Available Hours
        </label>

        <div className="space-y-4 mt-3">
          {availableHoursFields.map((field, dayIndex) => {
            // Get the day name from the field
            const dayName =
              (getValues(`availableHours.${dayIndex}.day`) as string) ||
              DAYS_OF_WEEK[dayIndex];
            return (
              <div key={field.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">{dayName}</h3>
                  <button
                    type="button"
                    onClick={() => addTimeSlot(dayIndex)}
                    className="text-primary hover:text-primary-dark flex items-center text-sm"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Time Slot
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Time slots for this day */}
                  {getValues(`availableHours.${dayIndex}.slots`)?.length > 0 ? (
                    getValues(`availableHours.${dayIndex}.slots`).map(
                      (slot: TimeSlot, slotIndex: number) => (
                        <div
                          key={`${dayIndex}-${slotIndex}`}
                          className="flex items-center space-x-2"
                        >
                          <select
                            className="border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary flex-1"
                            value={slot.start}
                            onChange={(e) => {
                              const newHours = [
                                ...getValues("availableHours"),
                              ] as AvailableHour[];
                              newHours[dayIndex].slots[slotIndex].start =
                                e.target.value;
                              setValue("availableHours", newHours, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            {TIME_SLOTS.map((time) => (
                              <option key={`start-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          <span className="text-gray-500">to</span>
                          <select
                            className="border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary flex-1"
                            value={slot.end}
                            onChange={(e) => {
                              const newHours = [
                                ...getValues("availableHours"),
                              ] as AvailableHour[];
                              newHours[dayIndex].slots[slotIndex].end =
                                e.target.value;
                              setValue("availableHours", newHours, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            {TIME_SLOTS.map((time) => (
                              <option key={`end-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove time slot"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No hours set for {dayName}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PracticeDetailsStep;
