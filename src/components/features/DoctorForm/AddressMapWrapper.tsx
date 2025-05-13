"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

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

interface AddressData {
  coordinates: { lat: number; lng: number };
  address: string;
  details?: AddressDetails;
}

interface AddressMapWrapperProps {
  onAddressSelect: (data: AddressData) => void;
  initialCoordinates?: { lat: number; lng: number };
  searchQuery?: string;
}

const AddressMapWrapper: React.FC<AddressMapWrapperProps> = (props) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mapDataRef = useRef({ initialLocationSet: false });

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    if (!isMapLoaded && loadAttempts < 3) {
      loadTimeoutRef.current = setTimeout(() => {
        setLoadAttempts((prev) => prev + 1);
      }, 5000);
    }

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [isMapLoaded, loadAttempts]);

  // Create a stabilized version of props to prevent unnecessary rerenders
  const stabilizedProps = useMemo(() => {
    // If we have coordinates from a previous selection, use those
    if (props.initialCoordinates && mapDataRef.current.initialLocationSet) {
      return {
        ...props,
        key: "stable-map-instance", // Helps maintain component instance
      };
    }

    // First time, record that we've set the initial location
    if (props.initialCoordinates) {
      mapDataRef.current.initialLocationSet = true;
    }

    return {
      ...props,
      key: "stable-map-instance",
    };
  }, [props]);

  // Dynamically import the map component to avoid SSR issues
  const AddressMapComponent = dynamic(
    () =>
      import("./AddressMap").then((mod) => {
        setIsMapLoaded(true);
        return mod.default;
      }),
    {
      ssr: false,
      loading: () => (
        <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-300">
          <div className="text-gray-500">Loading map...</div>
        </div>
      ),
    }
  );

  return (
    <div className="w-full h-[400px] rounded-lg border-2 border-gray-300 overflow-hidden">
      <AddressMapComponent
        key={stabilizedProps.key}
        onAddressSelect={stabilizedProps.onAddressSelect}
        initialCoordinates={stabilizedProps.initialCoordinates}
        searchQuery={stabilizedProps.searchQuery}
      />
    </div>
  );
};

export default AddressMapWrapper;
