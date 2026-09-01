import React, { useEffect, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "./Sidebar";

const DashboardWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #eef6fb;
  color: #1f2a37;
  font-family: "Arial", sans-serif;
`;

const fadeMarker = keyframes`
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
`;

const Content = styled.main`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
`;

const DashboardLayout = styled.div`
  width: 100%;
  height: calc(100vh - 3rem);
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
  display: flex;
  overflow: hidden;

  @media (max-width: 900px) {
    height: auto;
    flex-direction: column;
  }
`;

const LeftPanel = styled.aside`
  width: 260px;
  background: #173a67;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 900px) {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
`;

const PanelLogo = styled.div`
  font-weight: 700;
  letter-spacing: 0.12rem;
  font-size: 0.9rem;
  color: #ffffff;
`;

const PanelMenu = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  border-radius: 10px;
  padding: 0.3rem 0.55rem;
  cursor: pointer;
`;

const DestinationList = styled.div`
  display: grid;
  gap: 0.6rem;

  @media (max-width: 900px) {
    grid-auto-flow: column;
    grid-auto-columns: minmax(180px, 1fr);
  }
`;

const DestinationCard = styled.div`
  position: relative;
  height: 140px;
  border-radius: 10px;
  overflow: hidden;
  background-image:
    linear-gradient(to top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.15)),
    url(${(props) => props.$image});
  background-position: center;
  background-size: cover;
  background-color: #2f4f7f;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.02rem;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.2);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.05), rgba(15, 23, 42, 0.65));
  }

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 16px 26px rgba(15, 23, 42, 0.28);
  }
`;

const DestinationText = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DestinationTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
`;

const DestinationSubtitle = styled.span`
  font-size: 0.75rem;
  opacity: 0.85;
`;

const MapSection = styled.section`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #ffffff;
`;



const MapTitle = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  color: #1e3c72;
  font-weight: 800;
`;

const MapSubtitle = styled.p`
  margin: 0;
  color: #5b6b81;
  font-size: 0.85rem;
  font-weight: 500;
`;

const MapHeaderBar = styled.div`
  background: #ffffff;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;


const MapCard = styled.div`
  flex: 1;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .leaflet-container {
    width: 100%;
    height: 100%;
    flex: 1;
    border-radius: 0;
  }

  .photo-marker {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .marker-photo {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 3px solid #ffffff;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
    animation: ${fadeMarker} 1.2s ease;
    background-size: cover;
    background-position: center;
    transition: transform 0.3s ease;
    position: relative;
  }

  .marker-photo:hover {
    transform: scale(1.05);
  }

  .number-marker {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #2fbf71;
    color: #ffffff;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #ffffff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const MapControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ControlPill = styled.button`
  border: none;
  background: #ffffff;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const MapSearch = styled.input`
  border: none;
  background: #ffffff;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);
  font-size: 0.8rem;
  min-width: 180px;
`;

const MapFooterCard = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  background: #ffffff;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.15);
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f2a37;
  z-index: 1000;
`;

const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  font-size: 1.5rem;
  color: #1e3c72;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  font-size: 1.2rem;
  color: #dc3545;
`;

// Helper to fix Leaflet size issues
function MapInvalidator() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

function Dashboard() {
  const [, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasRetried, setHasRetried] = useState(false);
  const [mapType, setMapType] = useState('street');
  const [mapView, setMapView] = useState({ center: [20, 0], zoom: 2 });

  const mapLayers = {
    street: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    dark: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
  };

  const mapAttributions = {
    street: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  };

  const markers = useMemo(
    () => [
      {
        name: "Paris, France",
        coords: [48.8566, 2.3522],
        image: "https://media.gettyimages.com/id/917034246/photo/young-tourist-woman-reading-paris-city-map-against-tour-eiffel.jpg?s=612x612&w=0&k=20&c=mLWQj_6qyt8Qf5o_vTTW77MH3zCDiv6Xj7ed_6e8oBE=",
        description: "Boulevards, cafes, and river walks.",
      },
      {
        name: "Tokyo, Japan",
        coords: [35.6762, 139.6503],
        image: "https://media.istockphoto.com/id/1332999260/photo/tokyo.jpg?s=612x612&w=0&k=20&c=XejhHgFcHLlYBWhyuUmzptYPR-sOvwenA3HVYbVPkOk=",
        description: "Neon skylines and timeless temples.",
      },
      {
        name: "New York, USA",
        coords: [40.7128, -74.006],
        image: "https://media.gettyimages.com/id/1363510090/photo/confident-businesswoman-walking-on-brooklyn-bridge-new-york.jpg?s=612x612&w=0&k=20&c=HqUrzUYJhZcqWJEcUEi6LWuBwvh76sctSHdHjCtQuxI=",
        description: "City lights and iconic landmarks.",
      },
      {
        name: "Dubai, UAE",
        coords: [25.2048, 55.2708],
        image: "https://static.vecteezy.com/system/resources/thumbnails/014/790/003/small/tourist-take-of-dubai-free-photo.jpg",
        description: "Desert luxury and modern marvels.",
      },
      {
        name: "Sydney, Australia",
        coords: [-33.8688, 151.2093],
        image: "https://www.sydneytoptours.com/blog/wp-content/uploads/2019/12/Royal-Botanical-Garden-Sydney.jpg",
        description: "Harbor views and coastal adventures.",
      },
    ],
    []
  );

  const createMarkerIcon = (image) =>
    L.divIcon({
      className: "photo-marker",
      html: `<div class="marker-photo" style="background-image:url('${image || 'https://via.placeholder.com/46'}')"></div>`,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -18],
    });

  const numberMarkers = useMemo(
    () => [
      { coords: [51.5, -0.1], label: "1" },
      { coords: [34.05, -118.24], label: "2" },
      { coords: [52.52, 13.4], label: "3" },
      { coords: [19.43, -99.13], label: "4" },
      { coords: [35.68, 139.69], label: "5" },
      { coords: [1.29, 103.85], label: "6" },
      { coords: [55.75, 37.61], label: "7" },
      { coords: [59.33, 18.07], label: "8" },
      { coords: [48.85, 2.35], label: "9" },
      { coords: [41.9, 12.49], label: "10" },
      { coords: [30.04, 31.24], label: "11" },
      { coords: [-23.55, -46.63], label: "12" },
      { coords: [-33.87, 151.21], label: "13" },
      { coords: [-34.6, -58.38], label: "14" },
      { coords: [25.2, 55.27], label: "15" },
    ],
    []
  );

  const [realMarkers, setRealMarkers] = useState([]);

  useEffect(() => {
    const fetchRealMapData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/travel/top-itineraries/");
        if (response.ok) {
           const data = await response.json();
           setRealMarkers(data);
        }
      } catch (err) {
         console.error("Map data fetch error:", err);
      }
    };

    const verifyTokenAndFetchData = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/user/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          fetchRealMapData();
        } else if (response.status === 401 && !hasRetried) {
          const refreshed = await tryRefreshToken();
          if (refreshed) {
            setHasRetried(true);
            verifyTokenAndFetchData();
          } else {
            localStorage.clear();
            window.location.href = "/login";
          }
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message);
        localStorage.clear();
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    verifyTokenAndFetchData();
  }, [hasRetried]);

  const tryRefreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) return false;

    try {
      const response = await fetch("http://localhost:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access", data.access);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return <LoadingContainer>Loading Dashboard...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>Error loading dashboard: {error}</ErrorContainer>;
  }

  const filteredMarkers = realMarkers.filter(marker => 
    marker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (marker.city && marker.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardWrapper>
      <Sidebar />
      <Content>
        <DashboardLayout>
          <LeftPanel>
            <PanelHeader>
              <PanelLogo>TRAVEL BUDDY</PanelLogo>
              <PanelMenu type="button">≡</PanelMenu>
            </PanelHeader>
            <DestinationList>
              <DestinationCard 
                $image="https://media.gettyimages.com/id/580501537/photo/mount-rushmore-monument-under-blue-sky-south-dakota-united-states.jpg?s=612x612&w=0&k=20&c=YbDMyWNZ-yGfv9e45KU-1JRIaYutn7nMgEJCczyEY4E="
                onClick={() => setMapView({ center: [45.0, -100.0], zoom: 3 })}
                style={{ cursor: 'pointer' }}
              >
                <DestinationText>
                  <DestinationTitle>North America</DestinationTitle>
                  <DestinationSubtitle>City lights and national parks</DestinationSubtitle>
                </DestinationText>
              </DestinationCard>
              <DestinationCard 
                $image="https://whereintheworldisnina.com/wp-content/uploads/2023/08/things-to-do-in-europe.jpg"
                onClick={() => setMapView({ center: [50.0, 10.0], zoom: 4 })}
                style={{ cursor: 'pointer' }}
              >
                <DestinationText>
                  <DestinationTitle>Europe</DestinationTitle>
                  <DestinationSubtitle>Culture, castles, and classic routes</DestinationSubtitle>
                </DestinationText>
              </DestinationCard>
              <DestinationCard 
                $image="https://www.topasiatour.com/pic/Vietnam/city/hanoi/attractions/temple-of-literature.jpg"
                onClick={() => setMapView({ center: [34.0, 100.0], zoom: 3 })}
                style={{ cursor: 'pointer' }}
              >
                <DestinationText>
                  <DestinationTitle>Asia</DestinationTitle>
                  <DestinationSubtitle>Temples, food, and vibrant cities</DestinationSubtitle>
                </DestinationText>
              </DestinationCard>
              <DestinationCard 
                $image="https://cloudfront.safaribookings.com/blog/2022/01/00-the-top15-best-tourist-attractions-in-southafrica-BW-1200px-723x362.jpg"
                onClick={() => setMapView({ center: [0.0, 20.0], zoom: 3 })}
                style={{ cursor: 'pointer' }}
              >
                <DestinationText>
                  <DestinationTitle>Africa</DestinationTitle>
                  <DestinationSubtitle>Safari, deserts, and wild escapes</DestinationSubtitle>
                </DestinationText>
              </DestinationCard>
            </DestinationList>
          </LeftPanel>

          <MapSection>
            <MapHeaderBar>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <MapTitle>Global Explorer</MapTitle>
                <MapSubtitle>Your travel network at a glance</MapSubtitle>
              </div>
              <MapControls>
                <ControlPill 
                  type="button" 
                  style={{ background: mapType === 'street' ? '#1e3c72' : '#f8fafc', color: mapType === 'street' ? 'white' : '#475569', border: mapType === 'street' ? 'none' : '1px solid #e2e8f0' }}
                  onClick={() => setMapType('street')}
                >
                  Street
                </ControlPill>
                <ControlPill 
                  type="button" 
                  style={{ background: mapType === 'satellite' ? '#1e3c72' : '#f8fafc', color: mapType === 'satellite' ? 'white' : '#475569', border: mapType === 'satellite' ? 'none' : '1px solid #e2e8f0' }}
                  onClick={() => setMapType('satellite')}
                >
                  Satellite
                </ControlPill>
                <ControlPill 
                  type="button" 
                  style={{ background: mapType === 'dark' ? '#1e3c72' : '#f8fafc', color: mapType === 'dark' ? 'white' : '#475569', border: mapType === 'dark' ? 'none' : '1px solid #e2e8f0' }}
                  onClick={() => setMapType('dark')}
                >
                  Dark
                </ControlPill>
                <MapSearch 
                  placeholder="Search destinations (press Enter)..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && searchTerm.trim() !== '') {
                      try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=1`);
                        const data = await res.json();
                        if (data && data.length > 0) {
                          setMapView({ center: [parseFloat(data[0].lat), parseFloat(data[0].lon)], zoom: 6 });
                        } else {
                          alert("Location not found.");
                        }
                      } catch (err) {
                        console.error("Search error:", err);
                      }
                    }
                  }}
                />
              </MapControls>
            </MapHeaderBar>

            <MapCard>
              <MapCanvas>
                <MapContainer
                  center={[20, 0]}
                  zoom={2}
                  scrollWheelZoom={true}
                  zoomControl={false}
                  minZoom={2}
                  maxBounds={[[-90, -220], [90, 220]]}
                  style={{ width: "100%", height: "100%" }}
                  attributionControl={false}
                >
                  <MapInvalidator />
                  <MapController center={mapView.center} zoom={mapView.zoom} />
                  <TileLayer
                    key={mapType}
                    attribution={mapAttributions[mapType]}
                    url={mapLayers[mapType]}
                  />
                  <ZoomControl position="topright" />
                  {filteredMarkers.map((marker) => (
                    <Marker
                      key={marker.id || marker.name}
                      position={[marker.lat, marker.lon]}
                      icon={createMarkerIcon(marker.image)}
                    >
                      <Popup>
                        <strong>{marker.name}</strong>
                        <br />
                        {marker.city ? `${marker.city}` : ''}
                        <br />
                        <button type="button">Explore</button>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </MapCanvas>
              <MapFooterCard>{filteredMarkers.length} locations loaded</MapFooterCard>
            </MapCard>
          </MapSection>
        </DashboardLayout>
      </Content>
    </DashboardWrapper>
  );
}

export default Dashboard;