import { useEffect, useState, useRef } from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from "expo-location";

import { styles } from "./styles";

export default function App() {
  const [locations, setLocations] = useState<Array<LocationObject>>([]);
  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocations((prevstate) => [...prevstate, currentPosition]);
      mapRef.current?.setCamera({
        zoom: 16,
      });
    }
  }

  useEffect(() => {
    requestLocationPermissions().catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 4000,
        distanceInterval: 4,
      },
      (response) => {
        setLocations((prevstate) => [...prevstate, response]);
        console.log("Location Nova!!");
        mapRef.current?.animateCamera({
          center: response.coords,
        });
      }
    );
  }, []);

  return (
    <View style={styles.container}>
      {locations && (
        <MapView ref={mapRef} style={styles.map}>
          {locations.map((location, index) => (
            <Marker key={index} coordinate={location.coords} />
          ))}
        </MapView>
      )}
    </View>
  );
}
