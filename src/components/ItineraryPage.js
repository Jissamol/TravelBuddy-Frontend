import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaMapMarkerAlt,
  FaCity,
  FaSpinner,
  FaRoute,
  FaInfoCircle,
  FaArrowLeft,
  FaCompass,

  FaSuitcaseRolling,
  FaShareAlt,
  FaPlusCircle,
  FaCamera
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import LiveRoute from "./LiveRoute";
import ShareModal from "./ShareModal";

// ---------------- Styled Components (unchanged) ----------------
const MainContainer = styled.div`
  display: flex;
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex: 1;
`;

const ContentWrapper = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-5px);
  }
`;

const Title = styled.h1`
  color: white;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const RouteInfo = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RouteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: white;
  font-size: 1.1rem;
  flex-wrap: wrap;
`;

const Location = styled.span`
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 15px;
`;

const CollaborativeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
`;

const AvatarStack = styled.div`
  display: flex;
  margin-right: 0.5rem;
`;

const MiniAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.color || "#e2e8f0"};
  border: 2px solid #7c5cff;
  margin-left: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${props => props.color ? "white" : "#64748b"};
  
  &:first-child { margin-left: 0; }
`;

const ShareButton = styled.button`
  background: white;
  color: #7c5cff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  }
`;

const Arrow = styled.span`
  font-size: 1.5rem;
`;



const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-top: 1rem;
`;



const ItinerariesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }
`;

const DistanceBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(102, 126, 234, 0.95);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  z-index: 1;
  backdrop-filter: blur(10px);
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  padding: 0.4rem 0.9rem;
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.85rem;
  z-index: 1;
  text-transform: capitalize;
`;

const Image = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
`;

const ImageUploadOverlay = styled.label`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.8);
  color: #0f172a;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:hover {
    background: #ffffff;
    transform: scale(1.1);
    color: #1e3a8a;
  }
  
  input {
    display: none;
  }
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Name = styled.h3`
  color: #1a202c;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const Description = styled.p`
  color: #4a5568;
  margin: 1rem 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MapButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 15px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: white;
  gap: 1.5rem;
`;

const LoadingSpinner = styled(FaSpinner)`
  font-size: 3rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const PackForTripBtn = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.4);
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const EmptyStateIcon = styled(FaCompass)`
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1.5rem;
`;

const EmptyStateTitle = styled.h3`
  color: #1a202c;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const EmptyStateText = styled.p`
  color: #718096;
  font-size: 1.1rem;
`;

const ErrorContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ErrorTitle = styled.h2`
  color: #ef4444;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ErrorMessage = styled.p`
  color: #4a5568;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const RetryButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 15px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

// ---------------- Main Component ----------------
function ItineraryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const fallbackImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='540' viewBox='0 0 800 540'><rect width='800' height='540' fill='%23eef2f7'/><rect x='60' y='60' width='680' height='420' rx='28' fill='%23f8fafc' stroke='%23e2e8f0'/><circle cx='400' cy='220' r='70' fill='%23e2e8f0'/><path d='M300 360h200' stroke='%2394a3b8' stroke-width='12' stroke-linecap='round'/><path d='M260 400h280' stroke='%23cbd5e1' stroke-width='10' stroke-linecap='round'/></svg>";
  const [itineraries, setItineraries] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [tripInfo, setTripInfo] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const generationTriggered = useRef(false);

  const { startLocation: initialStart, destination: initialDest, startCoords, destCoords, plan_id, token } = location.state || {};
  
  const [tripDetails, setTripDetails] = useState({
    startLocation: initialStart,
    destination: initialDest
  });



  // Save itineraries to database
  const saveItinerariesToDatabase = async (itinerariesData) => {
    try {
      const token = localStorage.getItem("access");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const payload = {
        plan_id: plan_id,
        start_location: tripDetails.startLocation,
        destination: tripDetails.destination,
        itineraries: itinerariesData
      };

      const response = await fetch("http://localhost:8000/api/travel/save-plan-itineraries/", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("Itineraries saved successfully:", data);
      } else {
        console.warn("Failed to save itineraries:", data);
      }
    } catch (err) {
      console.error("Error saving itineraries to database:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "http://localhost:8000/api/travel/allitineraries/";
        if (plan_id) url += `?plan_id=${plan_id}`;
        else if (token) url += `?token=${token}`;
        else {
          // Fallback to manual generation if navigation state was just passed without saving
          if (generationTriggered.current) return;
          generationTriggered.current = true;
          if (!tripDetails.startLocation || !tripDetails.destination) {
            setErrorMsg("Missing travel plan details.");
            setLoading(false);
            return;
          }
          await generateNewItinerary();
          return;
        }

        const headers = {};
        const authToken = localStorage.getItem("access");
        if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error("Failed to fetch itinerary");
        const data = await response.json();
        
        if (data.length > 0) {
          const firstDay = data[0];
          if (firstDay.updated_at !== lastUpdated) {
            setLastUpdated(firstDay.updated_at);
            const allPlaces = data.flatMap(d => d.places);
            setItineraries(allPlaces);
            setTripDetails({
              startLocation: firstDay.start_location,
              destination: firstDay.destination
            });

            if (firstDay.share_token) {
              const tripRes = await fetch(`http://localhost:8000/api/travel/trips/token/${firstDay.share_token}/`);
              if (tripRes.ok) {
                const tripData = await tripRes.json();
                setTripInfo(tripData);
              }
            }
          }
          setLoading(false);
        } else {
          // If the plan exists but has no saved itineraries in the DB, generate them!
          if (generationTriggered.current) return;
          generationTriggered.current = true;
          if (!tripDetails.startLocation || !tripDetails.destination) {
            setErrorMsg("Missing travel plan details.");
            setLoading(false);
            return;
          }
          await generateNewItinerary();
        }
      } catch (err) {
        setErrorMsg(err.message);
        setLoading(false);
      }
    };

    const generateNewItinerary = async () => {
      try {
        let sc = startCoords;
        let dc = destCoords;

        if (!sc || !sc.lat) sc = await getCoordinates(tripDetails.startLocation);
        if (!dc || !dc.lat) dc = await getCoordinates(tripDetails.destination);

        if (!sc.lat || !dc.lat) {
          setErrorMsg("Could not find coordinates for the locations.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:8000/api/travel/route-itineraries/?start_lat=${sc.lat}&start_lon=${sc.lon}&dest_lat=${dc.lat}&dest_lon=${dc.lon}`
        );
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        const filtered = (data.itineraries || data).filter(item => {
          const n = item.name.toLowerCase();
          return !n.includes('scenic spot') && !n.includes('viewpoint') && !n.includes('view point');
        });

        setItineraries(filtered);
        if (filtered.length > 0) await saveItinerariesToDatabase(filtered);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const pollId = setInterval(fetchData, 10000);
    return () => clearInterval(pollId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan_id, token, lastUpdated, tripDetails.startLocation, tripDetails.destination]);

  const handleTogglePublic = async (isPublic) => {
    try {
      const response = await fetch(`http://localhost:8000/api/travel/trips/visibility/${plan_id}/`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ is_public: isPublic })
      });
      if (response.ok) {
        setTripInfo(prev => ({ ...prev, is_public: isPublic }));
      }
    } catch (err) {
      console.error("Error toggling visibility:", err);
    }
  };

  const handleImageUpload = async (e, item) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!item.id) {
      alert("This itinerary item isn't saved yet. Please wait for it to be saved before uploading an image.");
      return;
    }

    const formData = new FormData();
    formData.append("custom_image", file);

    try {
      const res = await fetch(`http://localhost:8000/api/travel/itineraries/${item.id}/image/`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload image.");
      const data = await res.json();
      
      setItineraries(itineraries.map(i => {
        if (i.id === item.id) {
          return { ...i, image: data.imageUrl };
        }
        return i;
      }));
    } catch (err) {
      alert(err.message);
    }
  };

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

  const handleBack = () => {
    navigate("/personalize-plan");
  };

  if (loading) {
    return (
      <MainContainer>
        <Sidebar />
        <PageContainer>
          <ContentWrapper>
            <LoadingContainer>
              <LoadingSpinner />
              <h2>Finding amazing places along your route...</h2>
              <p style={{ opacity: 0.8 }}>This may take a moment</p>
            </LoadingContainer>
          </ContentWrapper>
        </PageContainer>
      </MainContainer>
    );
  }

  if (errorMsg) {
    return (
      <MainContainer>
        <Sidebar />
        <PageContainer>
          <ContentWrapper>
            <BackButton onClick={handleBack}>
              <FaArrowLeft /> Back to Plan
            </BackButton>
            <ErrorContainer>
              <ErrorTitle>
                <FaInfoCircle /> Oops!
              </ErrorTitle>
              <ErrorMessage>{errorMsg}</ErrorMessage>
              <RetryButton onClick={handleBack}>
                <FaArrowLeft /> Try Again
              </RetryButton>
            </ErrorContainer>
          </ContentWrapper>
        </PageContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Sidebar />
      <PageContainer>
        <ContentWrapper>
          {selectedDestination ? (
            <LiveRoute
              destination={selectedDestination}
              destinationName={selectedName}
              destinationImage={selectedImage}
              destinationRating={selectedRating}
              onBack={() => {
                setSelectedDestination(null);
                setSelectedName("");
                setSelectedImage(null);
                setSelectedRating(null);
              }}
            />
          ) : (
            <>
              <BackButton onClick={handleBack}>
                <FaArrowLeft /> Back to Plan
              </BackButton>

              <Header>
                <Title>
                  <FaRoute /> Your Travel Itinerary
                </Title>

                {tripInfo && (
                  <CollaborativeGroup>
                    <AvatarStack>
                      <MiniAvatar color="#7c5cff" title={`Owner: ${tripInfo.collaborators_details?.[0]?.username || 'User'}`}>
                        {tripInfo.collaborators_details?.[0]?.username?.[0]?.toUpperCase() || 'U'}
                      </MiniAvatar>
                      {tripInfo.collaborators_details?.slice(1, 4).map(c => (
                        <MiniAvatar key={c.id} title={c.username}>
                          {c.username[0].toUpperCase()}
                        </MiniAvatar>
                      ))}
                      {(tripInfo.collaborators_details?.length || 0) > 4 && (
                        <MiniAvatar>+{tripInfo.collaborators_details.length - 4}</MiniAvatar>
                      )}
                    </AvatarStack>
                    <ShareButton onClick={() => setShowShareModal(true)}>
                      <FaShareAlt /> Share
                    </ShareButton>
                  </CollaborativeGroup>
                )}

                <RouteInfo>
                  <RouteRow>
                    <Location>{tripDetails.startLocation}</Location>
                    <Arrow>→</Arrow>
                    <Location>{tripDetails.destination}</Location>
                  </RouteRow>
                </RouteInfo>
                <Subtitle>
                  {itineraries.length > 0
                    ? `Journey with ${itineraries.length} amazing attractions`
                    : "Explore attractions on your journey"}
                </Subtitle>

              </Header>

              {itineraries.length === 0 ? (
                <EmptyState>
                  <EmptyStateIcon />
                  <EmptyStateTitle>No attractions found</EmptyStateTitle>
                  <EmptyStateText>
                    We couldn't find any tourist attractions along this route. Try a
                    different destination or explore nearby places instead.
                  </EmptyStateText>
                </EmptyState>
              ) : (
                <>
                  <ItinerariesGrid>
                    {itineraries.slice(0, visibleCount).map((item, index) => (
                      <Card key={item.id || index}>
                        <DistanceBadge>
                          <FaMapMarkerAlt />
                          {item.distance} km
                        </DistanceBadge>
                        {item.category && (
                          <CategoryBadge>
                            {item.category.replace("_", " ")}
                          </CategoryBadge>
                        )}
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = fallbackImage;
                          }}
                        />
                        <ImageUploadOverlay
                          title="Change image for this itinerary"
                          onClick={(e) => e.stopPropagation()}
                          style={{ top: 'auto', bottom: '260px', left: '10px' }} // position over the image, above the content
                        >
                          <FaCamera />
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, item)}
                          />
                        </ImageUploadOverlay>
                        <Content>
                          <Name>{item.name}</Name>
                          <InfoRow>
                            <FaCity />
                            {item.location || item.city || "Unknown location"}
                          </InfoRow>
                          <Description>{item.description}</Description>
                          <MapButton
                            onClick={() => {
                              setSelectedDestination([item.lat, item.lon]);
                              setSelectedName(item.name);
                              setSelectedImage(item.image);
                              setSelectedRating(item.rating);
                            }}
                          >
                            <FaMapMarkerAlt /> Get Directions
                          </MapButton>
                        </Content>
                      </Card>
                    ))}
                  </ItinerariesGrid>
                  {visibleCount < itineraries.length && (
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>
                      <button
                        onClick={() => setVisibleCount((prev) => prev + 20)}
                        style={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          border: "none",
                          padding: "12px 24px",
                          borderRadius: "25px",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                          transition: "transform 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                        onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                      >
                        Show more
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </ContentWrapper>
      </PageContainer>

      {showShareModal && tripInfo && (
        <ShareModal 
          trip={tripInfo} 
          onClose={() => setShowShareModal(false)}
          onTogglePublic={handleTogglePublic}
        />
      )}
    </MainContainer>
  );
}

export default ItineraryPage;