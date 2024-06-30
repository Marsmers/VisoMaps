import React, { useCallback, useState, useEffect } from "react";
import { GoogleMap , LoadScript, Marker } from "@react-google-maps/api";
import {
  addMarker,
  updateMarker,
  deleteMarker,
  getMarkers,
} from "./firestoreService";
import "./App.css";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export interface MarkerData {
  lat: number;
  lng: number;
  label: string;
}

const centerUkraine = { lat: 48.3794, lng: 31.1656 };

interface MapComponentProps {}

const MapComponent: React.FC<MapComponentProps> = () => {
  const [markers, setMarkers] = useState<{ id: string; data: MarkerData }[]>(
    []
  );
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      const fetchedMarkers = await getMarkers();
      setMarkers(fetchedMarkers);
    };
    fetchMarkers();
  }, []);

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const newMarker: MarkerData = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          label: (markers.length + 1).toString(),
        };
        addMarker(newMarker);
        setMarkers((current) => [
          ...current,
          { id: Date.now().toString(), data: newMarker },
        ]);
      }
    },
    [markers]
  );

  const handleMarkerDragEnd = useCallback(
    (event: google.maps.MapMouseEvent, id: string) => {
      if (event.latLng) {
        const updatedMarker: MarkerData = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          label: markers.find((marker) => marker.id === id)?.data.label || "",
        };
        updateMarker(id, updatedMarker);
        setMarkers((current) =>
          current.map((marker) =>
            marker.id === id ? { ...marker, data: updatedMarker } : marker
          )
        );
      }
    },
    [markers]
  );

  const handleDeleteMarker = useCallback((id: string | null) => {
    if (id) {
      deleteMarker(id);
      setMarkers((current) => current.filter((marker) => marker.id !== id));
    }
  }, []);

  const handleDeleteAllMarkers = useCallback(() => {
    markers.forEach((marker) => deleteMarker(marker.id));
    setMarkers([]);
  }, [markers]);

  return (
    <div className="map">
      <LoadScript googleMapsApiKey="AIzaSyDb9YTLLoqWiz8n6DIjNNgIAHellTNnVlY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={centerUkraine}
          zoom={5}
          onClick={handleMapClick}
        >
          {markers.map(({ id, data }) => (
            <Marker
              key={id}
              position={{ lat: data.lat, lng: data.lng }}
              label={data.label}
              draggable
              onDragEnd={(event) => handleMarkerDragEnd(event, id)}
              onClick={() => setSelectedMarker(id)}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      <button onClick={() => handleDeleteMarker(selectedMarker)}>
        Delete Selected Marker
      </button>
      <button onClick={handleDeleteAllMarkers}>Delete All Markers</button>
    </div>
  );
};

export default MapComponent;
