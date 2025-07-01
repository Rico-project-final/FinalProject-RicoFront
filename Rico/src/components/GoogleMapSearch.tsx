/**
 * GoogleMapSearch Component
 * -------------------------
 * Provides a Google Maps interface with a search box for users to search for businesses.
 * Displays a marker and info window for the selected business with its details and photo.
 * Users can connect the selected business by clicking the button in the info window.
 * The map centers on user's current location if available, else defaults to Tel Aviv.
 * 
 * Props:
 * - onPlaceSelected: Callback triggered when a place is selected from the search box.
 * - onConnectBusiness: Callback triggered when the user clicks "Connect my business" button.
 * - selectedBusiness: The currently selected Google Places business (may be null).
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  InfoWindow,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const centerDefault = {
  lat: 32.0853, // Default latitude (Tel Aviv)
  lng: 34.7818, // Default longitude
};

interface GoogleMapProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  onConnectBusiness: (place: google.maps.places.PlaceResult) => void;
  selectedBusiness: google.maps.places.PlaceResult | null;
}

const GoogleMapSearch: React.FC<GoogleMapProps> = ({
  onPlaceSelected,
  onConnectBusiness,
  selectedBusiness,
}) => {
  const [mapCenter, setMapCenter] = useState(centerDefault);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [locationBiasBounds, setLocationBiasBounds] = useState<google.maps.LatLngBoundsLiteral | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const onLoadSearchBox = useCallback((ref: google.maps.places.SearchBox) => {
    searchBoxRef.current = ref;
  }, []);

  // Handle when user selects a place from the search box suggestions
  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      if (!place.geometry?.location) return; // Ignore places without location data

      onPlaceSelected(place); // Inform parent about selected place
      setInfoWindowOpen(true); // Show info window for selected place
    }
  };

  // When `selectedBusiness` changes, update map center, marker and open info window
  useEffect(() => {
    if (selectedBusiness?.geometry?.location) {
      const loc = selectedBusiness.geometry.location;
      const position = {
        lat: loc.lat(),
        lng: loc.lng(),
      };
      setMapCenter(position);
      setMarkerPosition(position);
      setInfoWindowOpen(true);
    }
  }, [selectedBusiness]);

  // On mount, try to get user's current location for map centering and search bias
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const location = { lat: latitude, lng: longitude };
        setMapCenter(location);
        setLocationBiasBounds({
          north: latitude + 0.05,
          south: latitude - 0.05,
          east: longitude + 0.05,
          west: longitude - 0.05,
        });
      },
      () => {
        // If geolocation fails, fallback to default center and bounds
        setMapCenter(centerDefault);
        setLocationBiasBounds({
          north: centerDefault.lat + 0.05,
          south: centerDefault.lat - 0.05,
          east: centerDefault.lng + 0.05,
          west: centerDefault.lng - 0.05,
        });
      }
    );
  }, []);

  // Extract the first photo of the selected business if available
  const firstPhoto = selectedBusiness?.photos?.[0];

  return (
    <>
      {/* Google Places search box with location bias */}
      <StandaloneSearchBox
        onLoad={onLoadSearchBox}
        onPlacesChanged={onPlacesChanged}
        options={locationBiasBounds ? { bounds: locationBiasBounds } : undefined}
      >
        <input
          type="text"
          placeholder="חפש עסק"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `40px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            position: "absolute",
            left: "50%",
            marginLeft: "-120px",
            marginTop: "10px",
            zIndex: 10,
          }}
        />
      </StandaloneSearchBox>

      {/* Google Map showing the selected business marker */}
      <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={15}>
        {markerPosition && (
          <>
            {/* Marker at the business location */}
            <Marker
              position={markerPosition}
              onClick={() => setInfoWindowOpen(true)}
              cursor="pointer"
            />
            {/* InfoWindow shows business details and connect button */}
            {infoWindowOpen && selectedBusiness && (
              <InfoWindow
                position={markerPosition}
                onCloseClick={() => setInfoWindowOpen(false)}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, maxWidth: 300 }}>
                  {/* Business photo on the right, if exists */}
                  {firstPhoto && (
                    <img
                      src={firstPhoto.getUrl({ maxWidth: 100, maxHeight: 100 })}
                      alt="תמונת עסק"
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 6,
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {/* Business name, address and connect button on the left */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 5px" }}>{selectedBusiness.name}</h3>
                    <p style={{ margin: "0 0 10px", fontSize: 14 }}>
                      {selectedBusiness.formatted_address}
                    </p>
                    <button
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      onClick={() => onConnectBusiness(selectedBusiness)}
                    >
                      חבר את העסק שלי
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </>
        )}
      </GoogleMap>
    </>
  );
};

export default GoogleMapSearch;
