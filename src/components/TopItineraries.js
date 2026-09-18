import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaMapMarkerAlt,
  FaCompass,
  FaInfoCircle,
  FaBell,
  FaUserCircle,
  FaChevronRight,
  FaStar,
  FaRoute,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Sidebar from "./Sidebar";
import NearbyPlaceCard from "./NearbyPlaceCard";
import ShimmerCard from "./ShimmerCard";
import { fetchNearbyPlaces } from "../api/placesApi";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// ---------------- Styled Components ----------------
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
`;

const TopNav = styled.div`
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  flex-shrink: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavTitle = styled.h2`
  color: #1e3a8a;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #64748b;
  gap: 0.5rem;

  .active {
    color: #0f172a;
    font-weight: 600;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  color: #64748b;
  font-size: 1.2rem;

  svg {
    cursor: pointer;
    &:hover { color: #1e3a8a; }
  }
`;

const PageHeader = styled.div`
  background: #ffffff;
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const TitleGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  color: #0f172a;
  margin: 0 0 0.5rem;
  font-weight: 700;
`;

const PageSubtitle = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 1rem;
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterTags = styled.div`
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;

  &::-webkit-scrollbar { height: 0; }
`;

const TagButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid ${({ $active }) => ($active ? "#1e3a8a" : "#e2e8f0")};
  background: ${({ $active }) => ($active ? "#1e3a8a" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#475569")};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active }) => ($active ? "#1e293b" : "#f1f5f9")};
  }
`;

const SortSelect = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  outline: none;
  font-size: 0.9rem;
  color: #475569;
  background: #ffffff;
  cursor: pointer;
`;

const TwoColumnGrid = styled.div`
  display: flex;
  padding: 2rem;
  gap: 2rem;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const CardsColumn = styled.div`
  flex: 0 0 65%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  align-content: start;

  @media (max-width: 1024px) {
    flex: 1;
  }
`;

const RatingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #ca8a04;
`;

const LocationText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #64748b;
  font-size: 0.9rem;

  svg { color: #94a3b8; }
`;

const RightPanel = styled.div`
  flex: 1;
  position: relative;
`;

const StickyWrapper = styled.div`
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: calc(100vh - 280px);
  min-height: 400px;
`;

const MapPanelCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PanelTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const PanelTab = styled.button`
  flex: 1;
  padding: 1rem;
  border: none;
  background: transparent;
  font-weight: 600;
  font-size: 0.95rem;
  color: ${props => props.$active ? "#1e3a8a" : "#64748b"};
  border-bottom: 2px solid ${props => props.$active ? "#1e3a8a" : "transparent"};
  cursor: pointer;

  &:hover { color: #0f172a; }
`;

const MapWrapper = styled.div`
  flex: 1;
  background: #e2e8f0;
  position: relative;

  .leaflet-container {
    width: 100%;
    height: 100%;
  }
`;

const DetailSnippet = styled.div`
  padding: 1.5rem;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const MapDirectionsBtn = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: #1e3a8a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(30, 58, 138, 0.2);

  &:hover { background: #1e40af; }
`;

// Helper component to fix Map bounds
function MapBoundsUpdater({ place }) {
  const map = useMap();
  React.useEffect(() => {
    // Invalidate size to avoid layout flexbox rendering bugs
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (place && place.lat && place.lon) {
        map.flyTo([place.lat, place.lon], 13, { animate: true, duration: 0.75 });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [place, map]);
  return null;
}

// ---------------- Main Component ----------------
function TopItineraries() {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // New States
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Popularity");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  
  const filterOptions = ["All", "Tourist Spots", "Restaurants", "Hotels", "Nature", "Museums"];
  const fallbackImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='540' viewBox='0 0 800 540'><rect width='800' height='540' fill='%23eef2f7'/><rect x='60' y='60' width='680' height='420' rx='28' fill='%23f8fafc' stroke='%23e2e8f0'/><circle cx='400' cy='220' r='70' fill='%23e2e8f0'/><path d='M300 360h200' stroke='%2394a3b8' stroke-width='12' stroke-linecap='round'/><path d='M260 400h280' stroke='%23cbd5e1' stroke-width='10' stroke-linecap='round'/></svg>";

  const categoryMap = {
    "All": "tourist_spots",
    "Tourist Spots": "tourist_spots",
    "Restaurants": "restaurants",
    "Hotels": "hotels",
    "Nature": "nature",
    "Museums": "museums",
  };

  const normalizePlaces = (items) => {
    const seen = new Set();
    return (items || [])
      .map((item) => {
        if (!item) return null;
        const placeId = item.place_id || item.placeId;
        return {
          ...item,
          place_id: placeId,
          user_ratings_total: item.user_ratings_total ?? item.userRatingsTotal ?? 0,
        };
      })
      .filter((item) => {
        if (!item || !item.name || !item.place_id) return false;
        if (seen.has(item.place_id)) return false;
        seen.add(item.place_id);
        return true;
      });
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        setErrorMsg("Please allow location access to discover nearby places.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    const loadPlaces = async () => {
      if (!userPosition) return;
      try {
        setLoading(true);
        setErrorMsg("");
        const category = categoryMap[activeFilter] || "tourist_spots";
        const data = await fetchNearbyPlaces({
          lat: userPosition.lat,
          lon: userPosition.lon,
          category,
        });
        if (!Array.isArray(data)) {
          setItineraries([]);
          setSelectedPlace(null);
          setErrorMsg(data?.error || "Failed to load nearby places. Please try again.");
          return;
        }

        const processed = normalizePlaces(data);
        setItineraries(processed);
        setSelectedPlace(processed[0] || null);
      } catch (err) {
        console.error("Fetch error:", err);
        const fallbackMessage =
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load nearby places. Please try again.";
        setErrorMsg(fallbackMessage);
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, userPosition]);

  const filteredData = useMemo(() => normalizePlaces(itineraries), [itineraries]);

  const sortedData = useMemo(() => {
    const items = [...filteredData];
    if (sortBy === "Distance") {
      return items.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    if (sortBy === "Rating") {
      return items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return items.sort(
      (a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0)
    );
  }, [filteredData, sortBy]);

  const handleGetDirections = (place) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <DashboardContainer>
      <Sidebar />
      <MainContent>
        {/* Top Navbar */}
        <TopNav>
          <HeaderLeft>
            <NavTitle>Travel Buddy</NavTitle>
            <FaChevronRight color="#cbd5e1" size={14} />
            <Breadcrumb>
              <span>Dashboard</span>
              <FaChevronRight size={12} />
              <span className="active">My Trip Planner</span>
            </Breadcrumb>
          </HeaderLeft>
          <HeaderRight>
            <FaUserCircle size={28} />
          </HeaderRight>
        </TopNav>

        {/* Page Header Toolbar */}
        <PageHeader>
          <TitleGroup>
            <PageTitle>Nearby Places</PageTitle>
          </TitleGroup>
          <FilterBar>
            <SortSelect value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="Distance">Sort by Distance</option>
              <option value="Rating">Sort by Rating</option>
              <option value="Popularity">Sort by Popularity</option>
            </SortSelect>
          </FilterBar>
        </PageHeader>

        {loading ? (
          <TwoColumnGrid>
            <CardsColumn>
              {Array.from({ length: 6 }).map((_, idx) => (
                <ShimmerCard key={idx} />
              ))}
            </CardsColumn>
            <RightPanel>
              <StickyWrapper>
                <MapPanelCard />
              </StickyWrapper>
            </RightPanel>
          </TwoColumnGrid>
        ) : errorMsg ? (
          <div style={{ margin: '3rem auto', maxWidth: '600px', padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #fecaca', textAlign: 'center' }}>
            <FaInfoCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Oops!</h2>
            <p style={{ color: '#64748b' }}>{errorMsg}</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: '1.5rem', background: '#1e3a8a', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>Try Again</button>
          </div>
        ) : (
          <TwoColumnGrid>
            {/* Left: Cards List */}
            <CardsColumn>
              {sortedData.length === 0 ? (
                <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "3rem", background: "#fff", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                  <FaCompass size={48} color="#cbd5e1" style={{ marginBottom: "1rem" }} />
                  <h3 style={{ color: "#0f172a", margin: "0 0 0.5rem" }}>No places found</h3>
                  <p style={{ color: "#64748b", margin: 0 }}>Try changing your filters or discovering a new location.</p>
                </div>
              ) : (
                sortedData.map((place) => (
                  <NearbyPlaceCard
                    key={place.place_id}
                    place={place}
                    onSelect={() => setSelectedPlace(place)}
                    onAddToTrip={async (selected) => {
                      try {
                        let locationName = "Current Location";
                        if (userPosition) {
                          try {
                            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userPosition.lat}&lon=${userPosition.lon}`);
                            if (geoRes.ok) {
                              const geoData = await geoRes.json();
                              locationName = geoData.display_name || "Current Location";
                            }
                          } catch (e) {
                            console.error("Reverse geocoding failed", e);
                          }
                        }

                        const token = localStorage.getItem("access");
                        const headers = { "Content-Type": "application/json" };
                        if (token) headers["Authorization"] = `Bearer ${token}`;
                        
                        const res = await fetch("http://localhost:8000/api/travel/personalize-plan/", {
                          method: "POST",
                          headers,
                          body: JSON.stringify({
                            start_location: locationName,
                            destination: selected.name
                          })
                        });
                        
                        if (res.ok) {
                          navigate("/all-itineraries");
                        } else {
                          alert("Failed to add trip. Please try again.");
                        }
                      } catch (error) {
                        alert("Error adding trip.");
                      }
                    }}
                    onDirections={(selected) => {
                      setSelectedPlace(selected);
                      handleGetDirections(selected);
                    }}
                  />
                ))
              )}
            </CardsColumn>

            {/* Right: Sticky Panel */}
            <RightPanel>
              <StickyWrapper>
                <MapPanelCard>
                  <PanelTabs>
                    <PanelTab $active>Map Preview</PanelTab>
                    <PanelTab>Details</PanelTab>
                  </PanelTabs>
                  
                  <MapWrapper>
                    <MapContainer 
                      center={selectedPlace ? [selectedPlace.lat || 0, selectedPlace.lon || 0] : [20, 78]}
                      zoom={13} 
                      zoomControl={false}
                      attributionControl={false}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {sortedData.map((p) => (
                        <Marker key={p.place_id} position={[p.lat || 0, p.lon || 0]}>
                          <Popup>
                            <div style={{ width: 180 }}>
                              <img
                                src={p.image || fallbackImage}
                                alt={p.name}
                                style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 8, marginBottom: 8 }}
                                loading="lazy"
                                onError={(event) => {
                                  event.currentTarget.src = fallbackImage;
                                }}
                              />
                              <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{p.name}</div>
                              <div style={{ fontSize: 12, color: "#ca8a04", fontWeight: 600 }}>
                                <FaStar /> {p.rating || "4.5"}
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                      <MapBoundsUpdater place={selectedPlace} />
                    </MapContainer>
                  </MapWrapper>

                  <DetailSnippet>
                    {selectedPlace ? (
                      <>
                        <DetailHeader>
                          <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.2rem" }}>{selectedPlace.name}</h3>
                          <RatingBadge><FaStar /> {selectedPlace.rating || "4.5"}</RatingBadge>
                        </DetailHeader>
                        <LocationText style={{ margin: 0 }}>
                          <FaMapMarkerAlt /> {selectedPlace.address || "Nearby location"}
                        </LocationText>
                        <MapDirectionsBtn onClick={() => handleGetDirections(selectedPlace)}>
                          <FaRoute /> Get Live Route
                        </MapDirectionsBtn>
                      </>
                    ) : (
                      <p style={{ color: "#64748b", margin: 0, textAlign: "center" }}>Select a place to view live details</p>
                    )}
                  </DetailSnippet>
                </MapPanelCard>
              </StickyWrapper>
            </RightPanel>
            
          </TwoColumnGrid>
        )}
      </MainContent>
    </DashboardContainer>
  );
}

export default TopItineraries;