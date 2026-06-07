import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { setAddress as setNewAddress } from "@/store/reducers/selectedMapAddressSlice";
import { toast } from "sonner";
import { is_city_deliverable } from "@/interceptor/routes";
import { changeBranchId } from "@/events/actions";
import { useTranslation } from "react-i18next";
import GoogleMap from "../GoogleMap";
import LocationAutocomplete from "../LocationAutoComplete";

const DEFAULT_CENTER = {
  lat: Number(process.env.NEXT_PUBLIC_LATITUDE),
  lng: Number(process.env.NEXT_PUBLIC_LONGITUDE),
};

const LocationModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const selectedMapAddress = useSelector((state) => state.selectedCity.value);

  const [selectedLocation, setSelectedLocation] = useState({
    lat: selectedMapAddress?.lat || DEFAULT_CENTER.lat,
    lng: selectedMapAddress?.lng || DEFAULT_CENTER.lng,
  });
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (selectedMapAddress?.lat && selectedMapAddress?.lng) {
      setSelectedLocation({
        lat: selectedMapAddress.lat,
        lng: selectedMapAddress.lng,
      });
    }
  }, [selectedMapAddress]);

  // Reverse geocode for city/address
  const reverseGeocode = async (lat, lng) => {
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      return new Promise((resolve, reject) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results[0]) {
            let city = null;
            for (const component of results[0].address_components) {
              if (component.types.includes("locality")) {
                city = component.long_name;
                break;
              }
            }
            resolve(city || results[0].formatted_address);
          } else {
            reject(new Error("Failed to reverse geocode location."));
          }
        });
      });
    }
    return null;
  };

  // When marker is moved
  const handleMarkerMove = async (newPosition) => {
    try {
      const cityOrAddress = await reverseGeocode(newPosition.lat, newPosition.lng);
      if (cityOrAddress) {
        // Check deliverability first!
        const delivery = await is_city_deliverable({
          name: cityOrAddress,
          latitude: newPosition.lat,
          longitude: newPosition.lng,
        });
        if (delivery.error) {
          toast.error(delivery.message || "This city is not currently serviceable");
          return;
        }
        // Only update location/map/address/redux if deliverable
        setSelectedLocation(newPosition);
        setAddress(cityOrAddress);
        dispatch(setNewAddress({
          city: cityOrAddress,
          lat: newPosition.lat,
          lng: newPosition.lng,
        }));
        if (delivery.data && delivery.data[0]?.branch_id)
          changeBranchId({ branch_id: delivery.data[0].branch_id });
        toast.success("City is deliverable!");
        onClose();
      }
    } catch (error) {
      toast.error("Failed to get city for the new location.");
    }
  };

  // Handle selection from autocomplete or GPS
  const handleCitySelect = async (cityData) => {
    try {
      const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE;
      const cityName = cityData.city || cityData.name;
      const latitude = cityData.lat || cityData.latitude;
      const longitude = cityData.lng || cityData.longitude;

      const delivery = await is_city_deliverable({
        name: demoMode === "true" ? "bhuj" : cityName,
        latitude: demoMode === "true"
          ? DEFAULT_CENTER.lat
          : latitude,
        longitude: demoMode === "true"
          ? DEFAULT_CENTER.lng
          : longitude,
      });

      if (delivery.error) {
        toast.error(delivery.message);
        return;
      }

  
      setSelectedLocation({
        lat: demoMode === "true" ? DEFAULT_CENTER.lat : latitude,
        lng: demoMode === "true" ? DEFAULT_CENTER.lng : longitude,
      });
      dispatch(
        setNewAddress({
          city: demoMode === "true" ? "bhuj" : cityName,
          lat: demoMode === "true" ? DEFAULT_CENTER.lat : latitude,
          lng: demoMode === "true" ? DEFAULT_CENTER.lng : longitude,
        })
      );

      setAddress(cityName);

      if (delivery.data && delivery.data[0]?.branch_id)
        changeBranchId({ branch_id: delivery.data[0].branch_id });

      await router.push("/home");
      toast.success("City is deliverable!");
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Confirm button handler
  const handleSelect = async (value) => {
    if (!value) {
      toast.error("No value selected");
      return;
    }
    setAddress(value);

    try {
      const results = await geocodeByAddress(value);
      if (results.length === 0) {
        toast.error("No location found. Please try a different address.");
        return;
      }
      const latLng = await getLatLng(results[0]);
      const address_components = results[0].address_components;
      const city = address_components.find((component) =>
        component.types.includes("locality")
      );
      if (!city?.long_name) {
        toast.error("City not found in selected location");
        return;
      }

      const delivery = await is_city_deliverable({
        name: city.long_name,
        latitude: latLng.lat,
        longitude: latLng.lng,
      });

      if (delivery.error) {
        toast.error("This city is not currently serviceable");
        return;
      }

      setSelectedLocation({ lat: latLng.lat, lng: latLng.lng });
      // onClose();
      dispatch(
        setNewAddress({
          city: city.long_name,
          lat: latLng.lat,
          lng: latLng.lng,
        })
      );

      if (delivery.data && delivery.data[0]?.branch_id) {
        await changeBranchId({ branch_id: delivery.data[0].branch_id });
        toast.success("Location set successfully");
        onClose();
        await router.push("/home");
      } else {
        toast.error("Invalid delivery data received");
      }
    } catch (error) {
      toast.error("Error processing location. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      className="rounded"
      backdrop="blur"
      size="xl"
      isDismissable={false}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {t("select_location")}
            </ModalHeader>
            <ModalBody>
              <div className="w-full max-w-[600px] mx-auto">
                <LocationAutocomplete
                  onCitySelect={handleCitySelect}
                  inputValue={address}
                  setInputValue={setAddress}
                  defaultValue={address}
                />
                <div className="mt-4 w-full">
                  <GoogleMap
                    center={selectedLocation}
                    onMarkerMove={handleMarkerMove}
                    zoom={12}
                    height="450px"
                    GpsBtn={false}
                    onGpsBtnClick={(position) => console.log(position)}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                className="rounded"
              >
                {t("close")}
              </Button>
              <Button
                color="primary"
                onPress={() => handleSelect(address)}
                className="rounded"
              >
                {t("confirm")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LocationModal;