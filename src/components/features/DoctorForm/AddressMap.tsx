"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

// Ensure leaflet-control-geocoder is only imported on client-side
const LeafletGeocoder = React.memo(() => {
  const map = useMap();

  useEffect(() => {
    // Fix for Leaflet default marker icon
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });

    let geocoderControl: any = null;

    import("leaflet-control-geocoder").then((module) => {
      const { Geocoder } = module;

      geocoderControl = L.Control.geocoder({
        defaultMarkGeocode: false,
        placeholder: "Search address...",
        errorMessage: "Nothing found.",
        suggestMinLength: 3,
        suggestTimeout: 250,
      }).addTo(map);

      geocoderControl.on("markgeocode", function (e: any) {
        const { center, name } = e.geocode;

        const customEvent = new CustomEvent("addressSelected", {
          detail: {
            coordinates: {
              lat: center.lat,
              lng: center.lng,
            },
            address: name,
          },
        });
        window.dispatchEvent(customEvent);

        map.setView(center, 16);
      });
    });

    return () => {
      if (geocoderControl) {
        map.removeControl(geocoderControl);
      }
    };
  }, [map]);

  return null;
});

LeafletGeocoder.displayName = "LeafletGeocoder";

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

interface AddressMapProps {
  onAddressSelect: (data: {
    coordinates: { lat: number; lng: number };
    address: string;
    details?: AddressDetails;
  }) => void;
  initialCoordinates?: { lat: number; lng: number };
  searchQuery?: string;
}

const AddressMap: React.FC<AddressMapProps> = ({
  onAddressSelect,
  initialCoordinates = { lat: 51.505, lng: -0.09 }, // Default to London
  searchQuery,
}) => {
  const [markerPosition, setMarkerPosition] = useState(initialCoordinates);
  const mapRef = useRef<L.Map | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const prevSearchQueryRef = useRef<string | undefined>(searchQuery);
  const userSelectedLocationRef = useRef<{ lat: number; lng: number } | null>(
    null
  );

  // If user manually selected a location, we should prioritize that
  const getEffectivePosition = () => {
    return userSelectedLocationRef.current || markerPosition;
  };

  // When map is ready, set the initial marker position
  const handleMapReady = (map: L.Map) => {
    console.log("Map is ready");
    mapRef.current = map;

    // If user already selected a location (from previous renders), use that
    if (userSelectedLocationRef.current) {
      const { lat, lng } = userSelectedLocationRef.current;
      console.log("Restoring previously selected location:", { lat, lng });
      map.setView([lat, lng], 14);
      setMarkerPosition(userSelectedLocationRef.current);
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    console.log("🖱️ Map clicked at coordinates:", { lat, lng });

    // Store this as a user-selected location
    userSelectedLocationRef.current = { lat, lng };
    setMarkerPosition({ lat, lng });

    if (mapRef.current) {
      try {
        console.log("🔍 Fetching address for coordinates:", { lat, lng });
        // Direct approach using Nominatim API
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`;

        console.log("🌐 API URL:", apiUrl);

        // Use fetch API to directly call Nominatim
        fetch(apiUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("📊 Raw Nominatim response:", data);

            if (data && data.address) {
              const address = data.address;
              console.log("📬 Address data:", address);

              // Extract specific address components
              const addressComponents = {
                road: address.road || address.street || "",
                houseNumber: address.house_number || "",
                suburb: address.suburb || address.neighbourhood || "",
                city: address.city || address.town || address.village || "",
                county: address.county || "",
                state: address.state || "",
                postcode: address.postcode || "",
                country: address.country || "",
              };

              console.log(
                "🏠 Extracted address components:",
                addressComponents
              );

              // Create a formatted address string
              let formattedAddress = [];

              // Street address
              let streetAddress = "";
              if (addressComponents.houseNumber && addressComponents.road) {
                streetAddress = `${addressComponents.houseNumber} ${addressComponents.road}`;
              } else if (addressComponents.road) {
                streetAddress = addressComponents.road;
              }

              if (streetAddress) formattedAddress.push(streetAddress);
              if (addressComponents.city)
                formattedAddress.push(addressComponents.city);
              if (addressComponents.state) {
                if (addressComponents.postcode) {
                  formattedAddress.push(
                    `${addressComponents.state} ${addressComponents.postcode}`
                  );
                } else {
                  formattedAddress.push(addressComponents.state);
                }
              } else if (addressComponents.postcode) {
                formattedAddress.push(addressComponents.postcode);
              }
              if (addressComponents.country)
                formattedAddress.push(addressComponents.country);

              const finalAddress = formattedAddress.join(", ");
              console.log("📝 Formatted address:", finalAddress);

              // Pass the address details to the callback
              console.log("🚀 Sending address data to form");
              onAddressSelect({
                coordinates: { lat, lng },
                address: finalAddress,
                details: addressComponents,
              });
            } else {
              console.warn("⚠️ No address data found in API response");
              onAddressSelect({
                coordinates: { lat, lng },
                address: "Unknown location",
                details: {},
              });
            }
          })
          .catch((error) => {
            console.error("Error fetching address data:", error);
            onAddressSelect({
              coordinates: { lat, lng },
              address: "Error fetching location details",
              details: {},
            });
          });
      } catch (error) {
        console.error("Error in map click handler:", error);
      }
    }
  };

  // Initialize map with search query if provided
  useEffect(() => {
    // Skip if search query hasn't changed or is already being processed
    if (
      searchQuery === prevSearchQueryRef.current ||
      isSearching ||
      !searchQuery
    ) {
      return;
    }

    prevSearchQueryRef.current = searchQuery;

    if (mapRef.current) {
      console.log("Searching for address:", searchQuery);
      setIsSearching(true);

      // Use geocoding to search for the address
      const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery
      )}&limit=1&addressdetails=1`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);

            console.log("Found location for search query:", { lat, lng });

            if (mapRef.current && !isNaN(lat) && !isNaN(lng)) {
              // Only update if user hasn't manually selected a location
              if (!userSelectedLocationRef.current) {
                mapRef.current.setView([lat, lng], 16);
                setMarkerPosition({ lat, lng });
              }

              // Extract address details if available
              if (result.address) {
                const address = result.address;

                const addressComponents = {
                  road: address.road || address.street || "",
                  houseNumber: address.house_number || "",
                  suburb: address.suburb || address.neighbourhood || "",
                  city: address.city || address.town || address.village || "",
                  county: address.county || "",
                  state: address.state || "",
                  postcode: address.postcode || "",
                  country: address.country || "",
                };

                // Create a formatted address string
                const parts = [];
                if (addressComponents.road) {
                  if (addressComponents.houseNumber) {
                    parts.push(
                      `${addressComponents.houseNumber} ${addressComponents.road}`
                    );
                  } else {
                    parts.push(addressComponents.road);
                  }
                }
                if (addressComponents.city) parts.push(addressComponents.city);
                if (addressComponents.state)
                  parts.push(addressComponents.state);
                if (addressComponents.country)
                  parts.push(addressComponents.country);

                const finalAddress =
                  parts.join(", ") || result.display_name || searchQuery;

                // Only provide address data if user hasn't manually selected a location
                if (!userSelectedLocationRef.current) {
                  onAddressSelect({
                    coordinates: { lat, lng },
                    address: finalAddress,
                    details: addressComponents,
                  });
                }
              }
            }
          }
        })
        .catch((error) => {
          console.error("Error searching for address:", error);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }
  }, [searchQuery, onAddressSelect, isSearching]);

  // Listen for address selection events
  useEffect(() => {
    const handleAddressSelected = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { coordinates, address } = customEvent.detail;

      // Store as user selected location
      userSelectedLocationRef.current = coordinates;
      setMarkerPosition(coordinates);

      onAddressSelect({
        coordinates,
        address,
        details: {},
      });
    };

    window.addEventListener("addressSelected", handleAddressSelected);

    return () => {
      window.removeEventListener("addressSelected", handleAddressSelected);
    };
  }, [onAddressSelect]);

  const MapEvents = () => {
    const map = useMap();

    useEffect(() => {
      map.on("click", handleMapClick);

      return () => {
        map.off("click", handleMapClick);
      };
    }, [map]);

    return null;
  };

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <MapContainer
        center={[initialCoordinates.lat, initialCoordinates.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        whenReady={(map) => handleMapReady(map.target)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LeafletGeocoder />
        <Marker
          position={[getEffectivePosition().lat, getEffectivePosition().lng]}
        />
        <MapEvents />
      </MapContainer>
    </div>
  );
};

export default AddressMap;
