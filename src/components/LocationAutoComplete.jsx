import React, { useEffect, useRef, useCallback } from "react";
import { RiCrosshair2Fill, RiSearch2Line } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import debounce from "lodash/debounce";
import { Button } from "@heroui/button";
import { useTheme } from "next-themes";
import { Input } from "@heroui/input";
import { toast } from "sonner";

const LocationAutocomplete = ({
  latitude = Number(process.env.NEXT_PUBLIC_LATITUDE),
  longitude = Number(process.env.NEXT_PUBLIC_LONGITUDE),
  onCitySelect = () => {},
  hideLocationIcon = false,
  maxWidth = 600,
  defaultValue = "",
  inputValue: controlledInputValue,
  setInputValue: controlledSetInputValue,
}) => {
  const [internalInputValue, setInternalInputValue] =
    React.useState(defaultValue);

  const inputValue =
    controlledInputValue !== undefined
      ? controlledInputValue
      : internalInputValue;
  const setInputValue =
    controlledSetInputValue !== undefined
      ? controlledSetInputValue
      : setInternalInputValue;
  const [loading, setLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const inputWrapperRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const placesLibRef = useRef(null);
  const geocoderRef = useRef(null);
  const listRef = useRef(null);
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const loadLibraries = async () => {
      if (typeof google !== "undefined") {
        try {
          const { AutocompleteSuggestion, AutocompleteSessionToken } =
            await google.maps.importLibrary("places");
          const sessionToken = new AutocompleteSessionToken();
          placesLibRef.current = { AutocompleteSuggestion };
          sessionTokenRef.current = sessionToken;

          const { Geocoder } = await google.maps.importLibrary("geocoding");
          geocoderRef.current = new Geocoder();
        } catch (error) {
          toast.error(`Error loading Google Maps libraries: ${error.message}`);
        }
      }
    };
    loadLibraries();
  }, []);

  const fetchSuggestions = useCallback(
    async (value) => {
      if (!value || value.length < 3 || !placesLibRef.current) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const request = {
          input: value,
          sessionToken: sessionTokenRef.current,
          locationBias: {
            center: { lat: latitude, lng: longitude },
            radius: 50000,
          },
        };

        const autocompleteResponse =
          await placesLibRef.current.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            request
          );
        const suggestionsData =
          autocompleteResponse?.suggestions || autocompleteResponse?.data || [];
        if (Array.isArray(suggestionsData)) {
          setSuggestions(suggestionsData);
        } else {
          toast.error("Unable to fetch location suggestions");
          setSuggestions([]);
        }
      } catch (error) {
        toast.error(
          `Error fetching autocomplete suggestions: ${error.message}`
        );
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [latitude, longitude]
  );

  const debouncedFetchSuggestions = useRef(
    debounce(fetchSuggestions, 300)
  ).current;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedFetchSuggestions(value);
  };

  const handleSelectSuggestion = useCallback(
    async (suggestion) => {
      try {
        const place = suggestion.placePrediction.toPlace();
        await place.fetchFields({
          fields: ["displayName", "formattedAddress", "location"],
        });

        const cityName =
          place.displayName ||
          place.formattedAddress ||
          suggestion.placePrediction.text.text;

        const lat = place.location.lat();
        const lng = place.location.lng();

        setInputValue(cityName);
        setSuggestions([]);
        onCitySelect({ city: cityName, lat, lng, selectedAddress: suggestion });
      } catch (error) {
        toast.error(`Error fetching place details: ${error.message}`);
      }
    },
    [onCitySelect, setInputValue]
  );

  const reverseGeocode = useCallback(async (lat, lng) => {
    if (!geocoderRef.current) {
      toast.error("Geocoding service not available");
      return null;
    }
    try {
      const response = await geocoderRef.current.geocode({
        location: { lat, lng },
      });

      if (
        response.results &&
        Array.isArray(response.results) &&
        response.results.length > 0
      ) {
        let cityName = null;
        for (const result of response.results) {
          if (Array.isArray(result.address_components)) {
            if (!cityName) {
              for (const component of result.address_components) {
                if (component.types.includes("locality")) {
                  cityName = component.long_name;
                  break;
                }
              }
            }
            if (!cityName) {
              for (const component of result.address_components) {
                if (component.types.includes("sublocality")) {
                  cityName = component.long_name;
                  break;
                }
              }
            }
            if (cityName) break;
          }
        }
        return cityName || response.results[0].formatted_address;
      }
      return null;
    } catch (error) {
      toast.error(`Reverse geocoding failed: ${error.message}`);
      return null;
    }
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (suggestions.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          Math.min(prevIndex + 1, suggestions.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[highlightedIndex]);
      } else if (e.key === "Escape") {
        setSuggestions([]);
        setHighlightedIndex(-1);
      }
    },
    [suggestions, highlightedIndex, handleSelectSuggestion]
  );

  useEffect(() => {
    if (listRef.current && highlightedIndex >= 0) {
      const listItems = listRef.current.querySelectorAll("li");
      const highlightedItem = listItems[highlightedIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [highlightedIndex, suggestions]);

  const handleCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const cityName = await reverseGeocode(latitude, longitude);

          if (cityName) {
            setInputValue(cityName);
            onCitySelect({ city: cityName, lat: latitude, lng: longitude });
          } else {
            const fallbackCity = `Lat: ${latitude}, Lng: ${longitude}`;
            setInputValue(fallbackCity);
            onCitySelect({ city: false, lat: latitude, lng: longitude });
          }
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          toast.error(`Error getting current location: ${error.message}`);
        }
      );
    } else {
      setLoading(false);
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="relative w-full" style={{ maxWidth: `${maxWidth}px` }}>
      <Input
        type="text"
        placeholder="Type to choose a location"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full"
        startContent={
          <RiSearch2Line
            className="w-9 group-focus-within:text-primary-500 transition-colors"
            size={20}
          />
        }
        endContent={
          !hideLocationIcon ? (
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onClick={handleCurrentLocation}
              className="text-primary-500"
            >
              <RiCrosshair2Fill size={20} />
            </Button>
          ) : null
        }
      />

      {loading && (
        <div className="absolute z-50 w-full p-2">
          <div className="w-full h-1 bg-primary-500 animate-pulse"></div>
        </div>
      )}

      {suggestions?.length > 0 && !loading && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full max-h-[300px] overflow-y-auto 
    bg-white dark:bg-black border dark:border-gray-700 rounded-md shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
           <li
        key={index}
        onClick={() => handleSelectSuggestion(suggestion)}
        className={`p-2 cursor-pointer 
          ${highlightedIndex === index 
            ? "bg-primary-600 dark:bg-primary-600 text-white"
            : "hover:bg-primary-100 dark:hover:bg-primary-900 dark:text-white"}
        `}
      >
              {suggestion.placePrediction.text.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
