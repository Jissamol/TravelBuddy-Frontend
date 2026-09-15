import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import {
  FaArrowLeft,
  FaPlay,
  FaStop,
  FaDirections,
  FaVolumeUp,
  FaStar,
  FaExternalLinkAlt,
  FaCrosshairs,
  FaPlus,
  FaMinus,
  FaCar,
  FaCompass
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ---------------- Styled Components ----------------
const PageWrapper = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #e2e8f0;
`;

const MapSection = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  .leaflet-container {
    width: 100%;
    height: 100%;
  }
`;

// Floating Top Navigation
const TopNavContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  pointer-events: none; /* Let map be clickable behind empty space */
`;

const BackButton = styled.button`
  pointer-events: auto;
  background: #ffffff;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  color: #333;
  transition: all 0.2s;
  
  &:hover { background: #f8fafc; transform: scale(1.05); }
`;

const TopNavCenter = styled.div`
  pointer-events: auto;
  margin-left: 16px;
  background: #ffffff;
  padding: 10px 20px;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
`;

// Floating Place Card Overlay
const PlaceCard = styled.div`
  position: absolute;
  top: 80px;
  left: 20px;
  width: 340px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    top: auto;
    bottom: 200px;
    left: 10px;
    right: 10px;
    width: calc(100% - 20px);
    flex-direction: row;
    height: 130px;
  }
`;

const PlaceImage = styled.img`
  height: 140px;
  width: 100%;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 120px;
    height: 100%;
    flex-shrink: 0;
  }
`;

const PlaceInfo = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PlaceName = styled.h2`
  margin: 0 0 6px 0;
  font-size: 1.15rem;
  color: #0f172a;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlaceMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 8px;
`;

const RatingText = styled.span`
  color: #0f172a;
  font-weight: 600;
`;

const OpenStatus = styled.span`
  color: #10b981;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

const CardBtn = styled.button`
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  ${props => props.primary ? `
    background: #eff6ff;
    color: #2563eb;
    &:hover { background: #dbeafe; }
  ` : `
    background: #f1f5f9;
    color: #475569;
    &:hover { background: #e2e8f0; }
  `}
`;

// Floating Map Controls (Right Side)
const MapControlsContainer = styled.div`
  position: absolute;
  top: 80px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ControlButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #475569;
  font-size: 1.1rem;
  
  &:hover { color: #0f172a; background: #f8fafc; }
`;

const ZoomGroup = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 22px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  overflow: hidden;

  button {
    width: 44px;
    height: 44px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #475569;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover { background: #f1f5f9; }
    &:first-child { border-bottom: 1px solid #e2e8f0; }
  }
`;

// Bottom Navigation Panel (Glass Effect)
const BottomNavCard = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  padding: 20px;
  z-index: 1000;
  border: 1px solid rgba(255,255,255,0.4);
`;

const BadgeHover = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const NavStatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 10px;
`;

const NavStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.align || "center"};

  .value {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${props => props.highlight ? "#2563eb" : "#0f172a"};
    display: flex;
    align-items: baseline;
    gap: 4px;
    
    span { font-size: 0.9rem; font-weight: 600; color: #64748b; }
  }

  .label {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
  }
`;

const StartNavButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.tracking ? `
    background: #ef4444;
    color: white;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    &:hover { background: #dc2626; box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4); }
  ` : `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    &:hover { box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4); filter: brightness(1.05); }
  `}
`;

const VoiceIndicator = styled.div`
  text-align: center;
  margin-top: 8px;
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

// Dynamic Guidance Overlays
const CurrentInstruction = styled.div`
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  padding: 16px 24px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.25);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 90%;
  max-width: 400px;
`;

const InstructionIcon = styled.div`
  font-size: 2rem;
  color: #60a5fa;
`;

const InstructionText = styled.div`
  flex: 1;
  .dist { color: #60a5fa; font-weight: 700; font-size: 1rem; margin-bottom: 2px; }
  .desc { font-size: 1.1rem; font-weight: 600; }
`;

// Full-Screen Initial Loader
const FullLoader = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: white;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const LoadingSpinner = styled(FaCrosshairs)`
  font-size: 3rem;
  color: #2563eb;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0% { transform: scale(0.9); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(0.9); opacity: 0.7; }
  }
`;

// Custom Camera Controller hook for floating buttons
function MapCameraController({ currentPosition }) {
  const map = useMap();
  
  useEffect(() => {
    // Add custom control listeners to window safely
    window.leafletMapRef = map;
  }, [map]);

  return null;
}

// ---------------- LiveRoute Component ----------------
function LiveRoute({ destination, destinationName, destinationImage, destinationRating, onBack }) {
  const fallbackImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='540' viewBox='0 0 800 540'><rect width='800' height='540' fill='%23eef2f7'/><rect x='60' y='60' width='680' height='420' rx='28' fill='%23f8fafc' stroke='%23e2e8f0'/><circle cx='400' cy='220' r='70' fill='%23e2e8f0'/><path d='M300 360h200' stroke='%2394a3b8' stroke-width='12' stroke-linecap='round'/><path d='M260 400h280' stroke='%23cbd5e1' stroke-width='10' stroke-linecap='round'/></svg>";
  const [currentPosition, setCurrentPosition] = useState(null);
  const [route, setRoute] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [nextInstruction, setNextInstruction] = useState(null);
  const [distanceToNext, setDistanceToNext] = useState(null);
  const watchIdRef = useRef(null);
  const lastAnnouncedStep = useRef(-1);

  const [mapType, setMapType] = useState('street');

  const mapLayers = {
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    dark: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  };

  const mapAttributions = {
    street: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  };

  // Styled Markers
  const userIcon = new L.DivIcon({
    className: 'custom-user-marker',
    html: `<div style="width: 20px; height: 20px; background: #3b82f6; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);"></div><div style="width: 60px; height: 60px; background: rgba(59, 130, 246, 0.2); border-radius: 50%; position: absolute; top: -20px; left: -20px; animation: pulseLoc 2s infinite;"></div><style>@keyframes pulseLoc { 0% {transform: scale(0.5); opacity: 1;} 100% {transform: scale(1.5); opacity: 0;} }</style>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const destIcon = new L.DivIcon({
    className: 'custom-dest-marker',
    html: `<div style="width: 24px; height: 36px; background: #ef4444; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 2px 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
  });

  const fetchRoute = async (start, end) => {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&steps=true`
      );
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
        setRoute(coords);
        setDistance((data.routes[0].distance / 1000).toFixed(1));
        setDuration(Math.round(data.routes[0].duration / 60));
        
        const routeSteps = data.routes[0].legs[0].steps.map(step => ({
          instruction: step.maneuver.instruction || getManeuverInstruction(step.maneuver),
          distance: step.distance,
          location: [step.maneuver.location[1], step.maneuver.location[0]]
        }));
        setSteps(routeSteps);
      }
    } catch (err) {
      console.error("Route fetch error:", err);
    }
  };

  const getManeuverInstruction = (maneuver) => {
    const type = maneuver.type;
    const modifier = maneuver.modifier;
    if (type === 'depart') return 'Head ' + (modifier || 'straight');
    if (type === 'arrive') return 'You have arrived at your destination';
    if (type === 'turn') return `Turn ${modifier}`;
    if (type === 'roundabout') return 'Enter the roundabout';
    return 'Continue on route';
  };

  const speakInstruction = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const checkAndAnnounceNextStep = (currentPos) => {
    if (!tracking || steps.length === 0) return;
    for (let i = currentStepIndex; i < steps.length; i++) {
      const step = steps[i];
      const distToStep = calculateDistance(currentPos[0], currentPos[1], step.location[0], step.location[1]);
      setNextInstruction(step.instruction);
      setDistanceToNext(Math.round(distToStep));
      if (distToStep < 100 && lastAnnouncedStep.current !== i) {
        speakInstruction(`${distToStep < 50 ? 'Now' : 'Ahead'}, ${step.instruction}`);
        lastAnnouncedStep.current = i;
        setCurrentStepIndex(i);
        break;
      }
    }
  };

  const startTracking = () => {
    setTracking(true);
    speakInstruction("Navigation started.");
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setCurrentPosition(coords);
          fetchRoute(coords, destination);
          checkAndAnnounceNextStep(coords);
          if (window.leafletMapRef) window.leafletMapRef.setView(coords); // Auto pane
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }
  };

  const stopTracking = () => {
    setTracking(false);
    speakInstruction("Navigation stopped.");
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setCurrentPosition(coords);
          fetchRoute(coords, destination);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination]);

  // Button handlers
  const handleZoom = (dir) => {
    if (window.leafletMapRef) {
      const map = window.leafletMapRef;
      dir === 'in' ? map.zoomIn() : map.zoomOut();
    }
  };

  const handleLocateMe = () => {
    if (window.leafletMapRef && currentPosition) {
      window.leafletMapRef.flyTo(currentPosition, 16);
    }
  };

  if (!currentPosition) {
    return (
      <FullLoader>
        <LoadingSpinner />
        <h2 style={{color: '#0f172a', margin:0}}>Finding your location...</h2>
        <p style={{color: '#64748b', margin:0}}>Please ensure GPS is enabled.</p>
      </FullLoader>
    );
  }

  return (
    <PageWrapper>
      {/* 1. Floating Top Nav Area */}
      <TopNavContainer>
        <BackButton onClick={onBack}>
          <FaArrowLeft />
        </BackButton>
        <TopNavCenter>
          {destinationName || "Destination"}
        </TopNavCenter>
      </TopNavContainer>

      {/* 2. Floating Place Card Overlay */}
      <PlaceCard>
        <PlaceImage
          src={destinationImage || fallbackImage}
          alt={destinationName || "Destination"}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />
        <PlaceInfo>
          <PlaceName>{destinationName || "Destination"}</PlaceName>
          <PlaceMeta>
            <FaStar color="#f59e0b" /> <RatingText>{destinationRating || "4.8"}</RatingText> (124) • Tourist Spot
          </PlaceMeta>
          <PlaceMeta style={{ marginBottom: '12px' }}>
            <OpenStatus>Open Now</OpenStatus> • Closes 8 PM
          </PlaceMeta>
          <CardActions>
            <CardBtn primary onClick={handleLocateMe}>
              <FaDirections size={14} /> Directions
            </CardBtn>
            <CardBtn onClick={() => window.open(`https://maps.google.com/?q=${destination[0]},${destination[1]}`)}>
              <FaExternalLinkAlt size={12} /> Open in Maps
            </CardBtn>
          </CardActions>
        </PlaceInfo>
      </PlaceCard>

      {/* 3. Floating Map Controls */}
      <MapControlsContainer>
        <ControlButton 
          onClick={() => {
            const types = ['street', 'satellite', 'dark'];
            const next = types[(types.indexOf(mapType) + 1) % types.length];
            setMapType(next);
          }}
          title="Switch Map Style"
        >
          <FaCompass />
        </ControlButton>
        <ControlButton onClick={handleLocateMe}><FaCrosshairs /></ControlButton>
        <ZoomGroup>
          <button onClick={() => handleZoom('in')}><FaPlus size={12} /></button>
          <button onClick={() => handleZoom('out')}><FaMinus size={12} /></button>
        </ZoomGroup>
      </MapControlsContainer>

      {/* Dynamic Mid-Screen Instructions (if tracking) */}
      {tracking && nextInstruction && (
        <CurrentInstruction>
          <InstructionIcon><FaDirections /></InstructionIcon>
          <InstructionText>
            <div className="dist">{distanceToNext} m</div>
            <div className="desc">{nextInstruction}</div>
          </InstructionText>
        </CurrentInstruction>
      )}

      {/* 4. Full-Screen Background Map */}
      <MapSection>
        <MapContainer 
          center={currentPosition} 
          zoom={15} 
          zoomControl={false}
          attributionControl={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer 
            key={mapType}
            url={mapLayers[mapType]}
            attribution={mapAttributions[mapType]}
          />
          <MapCameraController currentPosition={currentPosition} />
          
          <Marker position={currentPosition} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
          
          {destination && (
            <Marker position={destination} icon={destIcon}>
              <Popup>{destinationName}</Popup>
            </Marker>
          )}
          
          {route.length > 0 && (
            <>
              {/* Outer stroke for thickness/glow */}
              <Polyline positions={route} color="#2563eb" weight={10} opacity={0.4} lineCap="round" lineJoin="round" />
              {/* Inner crisp line */}
              <Polyline positions={route} color="#3b82f6" weight={6} opacity={1} lineCap="round" lineJoin="round" />
            </>
          )}
        </MapContainer>
      </MapSection>

      {/* 5. Glass Bottom Navigation Panel */}
      <BottomNavCard>
        <BadgeHover><FaCar size={10} /> Fastest Route</BadgeHover>
        <NavStatsRow>
          <NavStat align="flex-start">
            <div className="value highlight">{distance || '--'} <span>km</span></div>
            <div className="label">Distance</div>
          </NavStat>
          <NavStat>
            <div className="value">{duration || '--'} <span>min</span></div>
            <div className="label">Est. Time</div>
          </NavStat>
          <NavStat align="flex-end">
            <div className="value">{distanceToNext || '--'} <span>m</span></div>
            <div className="label">Next Turn</div>
          </NavStat>
        </NavStatsRow>

        <StartNavButton tracking={tracking} onClick={tracking ? stopTracking : startTracking}>
          {tracking ? (
            <><FaStop /> Stop Navigation</>
          ) : (
            <><FaPlay /> Start Navigation</>
          )}
        </StartNavButton>
        
        {tracking && (
          <VoiceIndicator><FaVolumeUp size={12} /> Voice guidance active</VoiceIndicator>
        )}
      </BottomNavCard>

    </PageWrapper>
  );
}

export default LiveRoute;