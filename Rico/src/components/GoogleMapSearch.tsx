import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
  InfoWindow,
} from "@react-google-maps/api";

const libraries: ("places")[] = ["places"];
const containerStyle = {
  width: "100%",
  height: "400px",
};

const centerDefault = {
  lat: 32.0853,
  lng: 34.7818,
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

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      if (!place.geometry?.location) return;

      onPlaceSelected(place);
      setInfoWindowOpen(true);
    }
  };

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

  // מחלץ את התמונה הראשונה אם קיימת
  const firstPhoto = selectedBusiness?.photos?.[0];

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}
      libraries={libraries}
    >
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

      <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={15}>
        {markerPosition && (
          <>
            <Marker
              position={markerPosition}
              onClick={() => setInfoWindowOpen(true)}
              cursor="pointer"
            />
            {infoWindowOpen && selectedBusiness && (
              <InfoWindow
                position={markerPosition}
                onCloseClick={() => setInfoWindowOpen(false)}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, maxWidth: 300 }}>
                  {/* תמונה מימין */}
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

                  {/* תוכן טקסט וכפתור משמאל */}
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
    </LoadScript>
  );
};

export default GoogleMapSearch;
