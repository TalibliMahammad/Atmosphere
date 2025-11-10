import type { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

interface GeoLocation {
    coordinates: Coordinates | null;
    error: string | null;
    isLoading: boolean;
}



export function useGeoLocation() {
    const [locationData, setLocationData] = useState<GeoLocation>({
        coordinates: null,
        error: null,
        isLoading: false,
    })

    const getLocation = () => {
        setLocationData((prev) => ({ ...prev, isLoading: true, error: null }))
        if (!navigator.geolocation) {
            setLocationData({ coordinates: null, error: "Geolocation is not supported", isLoading: false })
        }

        navigator.geolocation.getCurrentPosition((position) => {
            return setLocationData({
                coordinates: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                },
                error: null,
                isLoading: false,
            });
        }, (error) => {

            let errorMessage: string;

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    errorMessage = "The request to get user location timed out."
                    break;
                default:
                    errorMessage = "An unknown error occurred."
                    break;
            }

            setLocationData({
                coordinates: null,
                error: errorMessage,
                isLoading: false,
            });
        },{
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );


    }

    useEffect(() => {
        getLocation()
    }, [])

    return {
        ...locationData,
        getLocation,
    };
}
