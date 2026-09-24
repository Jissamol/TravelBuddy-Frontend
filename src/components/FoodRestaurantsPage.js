import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaChevronRight,
  FaUserCircle,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaUtensils
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import NearbyPlaceCard from "./NearbyPlaceCard";

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
`;

const PageHeader = styled.div`
  background: #ffffff;
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TitleGroup = styled.div``;

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

const ContentWrapper = styled.div`
  padding: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  &::after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid #cbd5e1;
    border-top-color: #1e3a8a;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function FoodRestaurantsPage() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`http://localhost:8000/api/travel/nearby-places/?lat=${latitude}&lon=${longitude}&category=restaurants`);
          if (!res.ok) throw new Error("Failed to load nearby restaurants.");
          const data = await res.json();
          setPlaces(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError("Unable to retrieve your location. Please allow location access.");
        setLoading(false);
      }
    );
  };

  const handleImageUpload = async (e, place) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("place_id", place.placeId || place.id); // works for both google and osm

    try {
      const res = await fetch("http://localhost:8000/api/travel/places/override-image/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload image.");
      const data = await res.json();
      
      // Update the place in the list to show the new image instantly
      setPlaces(places.map(p => {
        if ((p.placeId || p.id) === (place.placeId || place.id)) {
          return { ...p, image: data.imageUrl };
        }
        return p;
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <DashboardContainer>
      <Sidebar />
      <MainContent>
        <TopNav>
          <HeaderLeft>
            <NavTitle>Travel Buddy</NavTitle>
            <FaChevronRight color="#cbd5e1" size={14} />
            <Breadcrumb>
              <span>Dashboard</span>
              <FaChevronRight size={12} />
              <span className="active">Food & Restaurants</span>
            </Breadcrumb>
          </HeaderLeft>
          <HeaderRight>
            <FaUserCircle size={28} />
          </HeaderRight>
        </TopNav>

        <PageHeader>
          <TitleGroup>
            <PageTitle><FaUtensils style={{ marginRight: '10px', color: '#1e3a8a' }} /> Food & Restaurants</PageTitle>
            <PageSubtitle>Discover great places to eat near your current location</PageSubtitle>
          </TitleGroup>
        </PageHeader>

        <ContentWrapper>
          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <LoadingSpinner />
              <p style={{ color: '#64748b', marginTop: '1rem' }}>Finding the best restaurants near you...</p>
            </div>
          ) : error ? (
            <div style={{ margin: '2rem auto', maxWidth: '600px', padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #fecaca', textAlign: 'center' }}>
              <FaExclamationTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
              <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Location Error</h2>
              <p style={{ color: '#64748b' }}>{error}</p>
              <button 
                onClick={fetchRestaurants}
                style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Try Again
              </button>
            </div>
          ) : places.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#fff", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
              <FaUtensils size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: "#0f172a", margin: "0 0 0.5rem", fontSize: "1.4rem" }}>No restaurants found</h3>
              <p style={{ color: "#64748b", margin: "0 0 1.5rem" }}>We couldn't find any restaurants near your current location.</p>
            </div>
          ) : (
            <Grid>
              {places.map((place) => (
                <NearbyPlaceCard 
                  key={place.placeId || place.id} 
                  place={place} 
                  onSelect={() => {}} 
                  onAddToTrip={() => alert("This feature can be connected to your active trip!")} 
                  onDirections={() => window.open(`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`, "_blank")}
                  onImageUpload={handleImageUpload}
                />
              ))}
            </Grid>
          )}
        </ContentWrapper>
      </MainContent>
    </DashboardContainer>
  );
}

export default FoodRestaurantsPage;
