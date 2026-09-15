import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaMapMarkerAlt, FaSpinner, FaWalking, FaBicycle, FaCar, FaTrain, FaExchangeAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Sidebar from "./Sidebar";

// Fix Leaflet Default Icon Issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const startIcon = L.divIcon({
  html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.5);"></div>`,
  className: 'custom-start-icon',
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

const destIcon = L.divIcon({
  html: `<svg viewBox="0 0 24 24" fill="#ef4444" width="36px" height="36px" stroke="white" stroke-width="1" style="filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.3));"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
  className: 'custom-dest-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 36]
});


// ---------------- Animations & Styled Components ----------------
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(124, 92, 255, 0.4); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(124, 92, 255, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(124, 92, 255, 0); }
`;

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #f4f9fc;
`;

const SidebarWrapper = styled.div`
  width: 260px;
  background: #fff;
  box-shadow: 2px 0 6px rgba(0,0,0,0.05);
  z-index: 10;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  padding: 2rem;
  overflow: hidden;
  box-sizing: border-box;
`;

const TwoColumnLayout = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 100%;
  height: 100%;
  animation: ${fadeUp} 0.6s ease-out;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: stretch;
    height: auto;
    overflow-y: auto;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 32px;
  overflow: hidden;
`;

const LeftCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
`;

const RightCard = styled(Card)`
  flex: 1;
  padding: 0; /* Padding handled internally for full-width map */
  display: flex;
  flex-direction: column;
  max-width: none;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const FormTitle = styled.h2`
  margin: 0 0 1.5rem;
  color: #2f3142;
  font-size: 1.5rem;
  font-weight: 700;
`;

const TransportRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 4px;
  }
`;

const TransportBtn = styled.button`
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 50%;
  border: none;
  background: ${({ active }) => (active ? "#7c5cff" : "#f4f5f9")};
  color: ${({ active }) => (active ? "#fff" : "#a0a4b8")};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    background: ${({ active }) => (active ? "#7c5cff" : "#e8eaf0")};
  }
`;

const RouteWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const RouteLine = styled.div`
  position: absolute;
  left: 11px;
  top: 25px;
  bottom: 25px;
  width: 2px;
  border-left: 2px dotted #a0a4b8;
  z-index: 1;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 2;
`;

const MarkerContainer = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ color }) => color};
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px ${({ color }) => color};
  animation: ${({ color }) => (color === '#7c5cff' ? pulse : 'none')} 2s infinite;
`;

const InputField = styled.div`
  flex: 1;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  color: #2f3142;
  font-size: 0.95rem;
  transition: border 0.3s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #7c5cff;
    background: #fff;
  }
  
  &::placeholder {
    color: #a0a4b8;
  }
`;

const LocationButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #a0a4b8;
  cursor: pointer;
  padding: 0;
  display: flex;

  &:hover {
    color: #7c5cff;
  }
`;

const SwapButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: -1.25rem;
  margin-bottom: -1.25rem;
  position: relative;
  z-index: 3;
`;

const SwapButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #a0a4b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  transition: all 0.2s;

  &:hover {
    color: #7c5cff;
    border-color: #7c5cff;
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 16px;
  background: #7c5cff;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(124, 92, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(124, 92, 255, 0.4);
    background: #6a4deb;
  }

  &:disabled {
    background: #c3b5ff;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Message = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  text-align: center;
  background: ${({ type }) => (type === "error" ? "#ffe5e5" : "#e5f7ed")};
  color: ${({ type }) => (type === "error" ? "#d32f2f" : "#2e7d32")};
`;

const LoadingSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;

// Right Card Styled Components
const InfoHeader = styled.div`
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f2f5;
`;

const DestTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  color: #2f3142;
  font-weight: 700;
`;

const EditLink = styled.a`
  color: #7c5cff;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const InfoStrip = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 32px;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  span:first-child {
    font-size: 0.8rem;
    color: #a0a4b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }
  
  span:last-child {
    font-size: 0.95rem;
    color: #2f3142;
    font-weight: 600;
  }
`;

const MapWrapper = styled.div`
  width: 100%;
  flex: 1;
  min-height: 380px;
  background: #e2e8f0;
  position: relative;
  border-radius: 0 0 24px 24px;
  overflow: hidden;

  .leaflet-container {
    width: 100%;
    height: 100%;
  }
`;

const SuggestionsWrap = styled.ul`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 180px;
  overflow-y: auto;
  z-index: 20;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
`;

const SuggestionItm = styled.li`
  padding: 10px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #2f3142;
  border-bottom: 1px solid #f0f2f5;
  &:last-child { border-bottom: none; }
  &:hover { background: #f8fafc; color: #7c5cff; }
`;

// Map View Updater for dynamic re-centering
function MapViewUpdater({ startCoords, destCoords }) {
  const map = useMap();

  // Fix for partial map rendering in flexbox
  React.useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);

  React.useEffect(() => {
    if (startCoords && destCoords) {
      if (startCoords[0] !== destCoords[0] || startCoords[1] !== destCoords[1]) {
        map.fitBounds([startCoords, destCoords], { padding: [50, 50] });
      } else {
        map.setView(startCoords, 10);
      }
    } else if (startCoords) {
      map.setView(startCoords, 10);
    } else if (destCoords) {
      map.setView(destCoords, 10);
    }
  }, [startCoords, destCoords, map]);
  return null;
}

// ---------------- Component ----------------
function PersonalizePlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { destination: initialDestination } = location.state || {};

  const [formData, setFormData] = useState({
    startLocation: "",
    destination: initialDestination || "",
    groupType: "solo",
  });

  const [debounceTimer, setDebounceTimer] = useState(null);

  const [activeTransport, setActiveTransport] = useState("car");
  const transportTypes = [
    { id: "walking", icon: <FaWalking /> },
    { id: "bike", icon: <FaBicycle /> },
    { id: "car", icon: <FaCar /> },
    { id: "train", icon: <FaTrain /> },
  ];

  const handleSwap = () => {
    setFormData((prev) => ({
      ...prev,
      startLocation: prev.destination,
      destination: prev.startLocation
    }));
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [suggestions, setSuggestions] = useState({
    startLocation: [],
    destination: [],
  });

  const [mapCoords, setMapCoords] = useState({
    startCoords: [40.4168, -3.7038], // Madrid
    destCoords: [41.3851, 2.1734],   // Barcelona
  });

  const [allRoutePoints, setAllRoutePoints] = useState({
    car: [],
    bike: [],
    walking: [],
    train: []
  });

  // Fetch real road routes from OSRM for all modes
  React.useEffect(() => {
    const fetchRoutes = async () => {
      if (!mapCoords.startCoords || !mapCoords.destCoords) return;
      
      const fetchProfile = async (profileName) => {
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/${profileName}/${mapCoords.startCoords[1]},${mapCoords.startCoords[0]};${mapCoords.destCoords[1]},${mapCoords.destCoords[0]}?overview=full&geometries=geojson&alternatives=true`
          );
          const data = await response.json();
          if (data.routes && data.routes.length > 0) {
            return data.routes.map(r => r.geometry.coordinates.map(coord => [coord[1], coord[0]]));
          }
        } catch (err) {
          console.error(`Route fetch error for ${profileName}:`, err);
        }
        return [[mapCoords.startCoords, mapCoords.destCoords]];
      };

      const [driving, bicycle, foot] = await Promise.all([
        fetchProfile("driving"),
        fetchProfile("bicycle"),
        fetchProfile("foot")
      ]);

      setAllRoutePoints({
        car: driving,
        train: driving, // fallback to driving for train
        bike: bicycle,
        walking: foot
      });
    };

    fetchRoutes();
  }, [mapCoords]);

  // Fetch autocomplete suggestions
  const fetchSuggestions = async (query, field) => {
    if (!query) {
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`
      );
      
      if (res.status === 429) {
        console.warn("Nominatim rate limit hit");
        return;
      }

      const data = await res.json();
      const formatted = data.map((item) => ({
        description: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }));
      setSuggestions((prev) => ({ ...prev, [field]: formatted }));
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  // Use current location
  const handleUseMyLocation = async (field) => {
    if (formData[field]) {
      setFormData((prev) => ({ ...prev, [field]: "" }));
      return;
    }
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'TravelBuddyApp/1.0'
              }
            }
          );
          
          if (response.status === 429) {
            alert("Too many requests! Please slow down and wait a few seconds.");
            return;
          }

          const data = await response.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          setFormData((prev) => ({ ...prev, [field]: address }));
          if (field === "startLocation") {
            setMapCoords((prev) => ({ ...prev, startCoords: [latitude, longitude] }));
          } else {
            setMapCoords((prev) => ({ ...prev, destCoords: [latitude, longitude] }));
          }
        } catch (err) {
          alert("Failed to fetch location details.");
        }
      },
      (error) => {
        if (error.code === 1) {
          alert("Permission denied. Please allow location access.");
        } else {
          alert("Unable to retrieve your location.");
        }
      }
    );
  };

  // Handle input typing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Debounce geocoding requests
    if (name === "startLocation" || name === "destination") {
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        if (value.trim().length > 2) {
          fetchSuggestions(value, name);
        }
      }, 600); // 600ms delay
      setDebounceTimer(timer);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (field, suggestion) => {
    setFormData((prev) => ({ ...prev, [field]: suggestion.description }));
    if (field === "startLocation") {
      setMapCoords((prev) => ({ ...prev, startCoords: [parseFloat(suggestion.lat), parseFloat(suggestion.lon)] }));
    } else {
      setMapCoords((prev) => ({ ...prev, destCoords: [parseFloat(suggestion.lat), parseFloat(suggestion.lon)] }));
    }
    setSuggestions((prev) => ({ ...prev, [field]: [] }));
  };

  // Helper function to get coordinates for a location
  const getCoordinates = async (locationName) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationName
        )}&limit=1`,
        {
          headers: {
            'User-Agent': 'TravelBuddyApp/1.0'
          }
        }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon };
      }
    } catch (err) {
      console.error("Error fetching coordinates:", err);
    }
    return { lat: null, lon: null };
  };

// inside PersonalizePlan, update AChandleSubmit's saving logic
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");
  try {
    setMessage("Getting location coordinates...");
    setMessageType("success");

    const startCoords = await getCoordinates(formData.startLocation);
    await new Promise(resolve => setTimeout(resolve, 1000)); // rate limit
    const destCoords = await getCoordinates(formData.destination);

    if (!startCoords.lat || !destCoords.lat) {
      setMessage("Could not find coordinates for the locations. Please try different location names.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    // Build payload (include coords)
    const payload = {
      startLocation: formData.startLocation,
      destination: formData.destination,
      start_lat: startCoords.lat,
      start_lon: startCoords.lon,
      dest_lat: destCoords.lat,
      dest_lon: destCoords.lon,
      groupType: formData.groupType || "solo",
    };

    setMessage("Saving your plan...");
    setMessageType("success");

    // Try to POST the plan (authenticated if token present)
    const token = localStorage.getItem("access");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let savedPlanId = null;
    try {
      const resp = await fetch("http://localhost:8000/api/travel/personalize-plan/", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      // Parse response if possible
      const data = await resp.json().catch(() => ({}));
      if (resp.status === 201 || resp.ok) {
        // prefer plan_id if view returns it, else try `id`
        savedPlanId = data.plan_id || data.id || data.pk || null;
        // if serializer returned whole object but no id, try to read serializer data
        if (!savedPlanId && data && typeof data === "object") {
          if (data.id) savedPlanId = data.id;
        }
      } else if (resp.status === 401) {
        // token expired — remove and continue as guest
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      } else {
        console.warn("Plan save returned non-OK:", resp.status, data);
      }
    } catch (err) {
      console.error("Error saving plan to backend:", err);
      // proceed as guest if backend down
    }

    setMessage("Loading your travel itinerary...");
    setMessageType("success");

    // Pass plan_id (can be null) and coordinates to itinerary route
    navigate("/itinerary", {
      state: {
        ...formData,
        startCoords,
        destCoords,
        plan_id: savedPlanId,
      },
    });

  } catch (error) {
    console.error("Error:", error);
    setMessage("An error occurred while processing your request.");
    setMessageType("error");
  } finally {
    setLoading(false);
  }
};

  return (
    <PageContainer>
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>

      <ContentWrapper>
        <TwoColumnLayout>
          
          {/* Left Card: Create a Route */}
          <LeftCard>
            <FormTitle>Create a route</FormTitle>

            <TransportRow>
              {transportTypes.map((t) => (
                <TransportBtn 
                  key={t.id} 
                  type="button"
                  active={activeTransport === t.id}
                  onClick={() => setActiveTransport(t.id)}
                >
                  {t.icon}
                </TransportBtn>
              ))}
            </TransportRow>

            <form onSubmit={handleSubmit}>
              <RouteWrapper>
                <RouteLine />
                
                {/* Starting Location */}
                <InputGroup>
                  <MarkerContainer><Dot color="#7c5cff" /></MarkerContainer>
                  <InputField>
                    <Input
                      type="text"
                      name="startLocation"
                      value={formData.startLocation}
                      onChange={handleInputChange}
                      placeholder="Current Location"
                      autoComplete="off"
                      required
                    />
                    <LocationButton
                      type="button"
                      onClick={() => handleUseMyLocation("startLocation")}
                      title="Use My Location"
                    >
                       <FaMapMarkerAlt />
                    </LocationButton>
                    {suggestions.startLocation.length > 0 && (
                      <SuggestionsWrap>
                        {suggestions.startLocation.map((s, idx) => (
                          <SuggestionItm
                            key={idx}
                            onClick={() => handleSuggestionClick("startLocation", s)}
                          >
                            {s.description}
                          </SuggestionItm>
                        ))}
                      </SuggestionsWrap>
                    )}
                  </InputField>
                </InputGroup>

                <SwapButtonContainer>
                  <SwapButton type="button" onClick={handleSwap} title="Swap Locations">
                    <FaExchangeAlt />
                  </SwapButton>
                </SwapButtonContainer>

                {/* Destination */}
                <InputGroup>
                  <MarkerContainer><Dot color="#ffd400" /></MarkerContainer>
                  <InputField>
                    <Input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="Destination"
                      autoComplete="off"
                      required
                    />
                    <LocationButton
                      type="button"
                      onClick={() => handleUseMyLocation("destination")}
                      title="Use My Location"
                    >
                      <FaMapMarkerAlt />
                    </LocationButton>
                    {suggestions.destination.length > 0 && (
                      <SuggestionsWrap>
                        {suggestions.destination.map((s, idx) => (
                          <SuggestionItm
                            key={idx}
                            onClick={() => handleSuggestionClick("destination", s)}
                          >
                            {s.description}
                          </SuggestionItm>
                        ))}
                      </SuggestionsWrap>
                    )}
                  </InputField>
                </InputGroup>
              </RouteWrapper>



              <SubmitBtn type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Processing...
                  </>
                ) : (
                  "Let's go!"
                )}
              </SubmitBtn>

              {message && <Message type={messageType}>{message}</Message>}
            </form>
          </LeftCard>

          {/* Right Card: Destination Preview */}
          <RightCard>
            <InfoHeader>
              <DestTitle>Hotel Ona el Marqués</DestTitle>
              <EditLink>Edit card</EditLink>
            </InfoHeader>
            <InfoStrip>
              <InfoItem>
                <span>Address</span>
                <span>Calle las Rosas, 4</span>
              </InfoItem>
              <InfoItem>
                <span>Check in</span>
                <span>12:00</span>
              </InfoItem>
              <InfoItem>
                <span>Check out</span>
                <span>14:00</span>
              </InfoItem>
              <InfoItem>
                <span>Phone</span>
                <span>+34 922 86 12 00</span>
              </InfoItem>
            </InfoStrip>

            <MapWrapper>
              <MapContainer 
                center={[40.9, -0.75]} 
                zoom={6} 
                scrollWheelZoom={true} 
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={mapCoords.startCoords} icon={startIcon}></Marker>
                <Marker position={mapCoords.destCoords} icon={destIcon}></Marker>
                {allRoutePoints[activeTransport] && allRoutePoints[activeTransport].map((points, index) => {
                  const isMain = index === 0;
                  return (
                    <Polyline 
                      key={`${activeTransport}-${index}`}
                      positions={points.length > 0 ? points : [mapCoords.startCoords, mapCoords.destCoords]} 
                      color={isMain ? "#7c5cff" : "#a0a4b8"} 
                      weight={isMain ? 6 : 5} 
                      dashArray={isMain ? "" : "8, 8"}
                      opacity={isMain ? 1 : 0.8}
                    />
                  );
                })}
                <MapViewUpdater startCoords={mapCoords.startCoords} destCoords={mapCoords.destCoords} />
              </MapContainer>
            </MapWrapper>
          </RightCard>

        </TwoColumnLayout>
      </ContentWrapper>
    </PageContainer>
  );
}

export default PersonalizePlan;