import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaChevronRight,
  FaUserCircle,
  FaSuitcaseRolling,
  FaPlus,
  FaBuilding,
  FaClock,
  FaMoneyBillWave,
  FaPhone,
  FaMapMarkerAlt,
  FaExclamationTriangle
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

const ContentWrapper = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SelectBox = styled.select`
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  width: 300px;
  background: #fff;
  outline: none;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.active ? "#1e3a8a" : "#64748b"};
  border-bottom: 3px solid ${props => props.active ? "#1e3a8a" : "transparent"};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #1e3a8a;
  }
`;

const FormContainer = styled.form`
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-width: 800px;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #334155;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  width: 100%;
`;

const Button = styled.button`
  background: #1e3a8a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #1e40af;
  }
`;

const AccommodationsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const AccCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3b82f6;
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

function AccommodationPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [accommodations, setAccommodations] = useState([]);
  const [activeTab, setActiveTab] = useState("saved");

  // Nearby hotels state
  const [nearbyHotels, setNearbyHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [hotelsError, setHotelsError] = useState(null);

  const [formData, setFormData] = useState({
    hotel_name: "",
    address: "",
    check_in: "",
    check_out: "",
    price: "",
    booking_reference: "",
    contact_number: "",
    notes: ""
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (selectedPlanId) {
      fetchAccommodations(selectedPlanId);
    } else {
      setAccommodations([]);
    }
  }, [selectedPlanId]);

  useEffect(() => {
    if (activeTab === "discover" && nearbyHotels.length === 0) {
      fetchNearbyHotels();
    }
  }, [activeTab]);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch("http://localhost:8000/api/travel/plans/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
        if (data.length > 0) setSelectedPlanId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAccommodations = async (planId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/travel/plans/${planId}/accommodations/`);
      if (res.ok) {
        const data = await res.json();
        setAccommodations(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNearbyHotels = () => {
    setLoadingHotels(true);
    setHotelsError(null);
    
    if (!navigator.geolocation) {
      setHotelsError("Geolocation is not supported by your browser.");
      setLoadingHotels(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`http://localhost:8000/api/travel/nearby-places/?lat=${latitude}&lon=${longitude}&category=hotels`);
          if (!res.ok) throw new Error("Failed to load nearby hotels.");
          const data = await res.json();
          setNearbyHotels(data);
        } catch (err) {
          setHotelsError(err.message);
        } finally {
          setLoadingHotels(false);
        }
      },
      (error) => {
        setHotelsError("Unable to retrieve your location. Please allow location access.");
        setLoadingHotels(false);
      }
    );
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlanId) return alert("Please select a trip first.");

    try {
      const res = await fetch(`http://localhost:8000/api/travel/plans/${selectedPlanId}/accommodations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access")}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Accommodation added! It has also been inserted into your itinerary.");
        setFormData({
          hotel_name: "", address: "", check_in: "", check_out: "", price: "", booking_reference: "", contact_number: "", notes: ""
        });
        fetchAccommodations(selectedPlanId);
        setActiveTab("saved");
      } else {
        alert("Failed to add accommodation.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e, place) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);
    form.append("place_id", place.placeId || place.id); 

    try {
      const res = await fetch("http://localhost:8000/api/travel/places/override-image/", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to upload image.");
      const data = await res.json();
      
      setNearbyHotels(nearbyHotels.map(p => {
        if ((p.placeId || p.id) === (place.placeId || place.id)) {
          return { ...p, image: data.imageUrl };
        }
        return p;
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  const prefillFormWithHotel = (hotel) => {
    setFormData({
      ...formData,
      hotel_name: hotel.name,
      address: hotel.address || hotel.location || "",
    });
    setActiveTab("add");
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
              <span className="active">Accommodations</span>
            </Breadcrumb>
          </HeaderLeft>
          <HeaderRight>
            <FaUserCircle size={28} />
          </HeaderRight>
        </TopNav>

        <PageHeader>
          <TitleGroup>
            <PageTitle><FaSuitcaseRolling style={{ marginRight: '10px', color: '#1e3a8a' }} /> Accommodation Management</PageTitle>
          </TitleGroup>
        </PageHeader>

        <ContentWrapper>
          <div style={{ width: "100%" }}>
            <SelectBox value={selectedPlanId} onChange={(e) => setSelectedPlanId(e.target.value)}>
              <option value="">-- Select a Trip --</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>{p.start_location} → {p.destination}</option>
              ))}
            </SelectBox>
          </div>

          <TabsContainer>
            <Tab active={activeTab === "saved"} onClick={() => setActiveTab("saved")}>Saved Accommodations</Tab>
            <Tab active={activeTab === "discover"} onClick={() => setActiveTab("discover")}>Discover Nearby Hotels</Tab>
            <Tab active={activeTab === "add"} onClick={() => setActiveTab("add")}>Add Manually</Tab>
          </TabsContainer>

          {activeTab === "saved" && (
            <AccommodationsList>
              {accommodations.length === 0 ? (
                <p style={{ color: "#64748b" }}>No accommodations added for this trip yet.</p>
              ) : (
                accommodations.map(acc => (
                  <AccCard key={acc.id}>
                    <h4 style={{ margin: "0 0 0.5rem" }}><FaBuilding color="#1e3a8a" /> {acc.hotel_name}</h4>
                    <p style={{ margin: "0 0 0.5rem", color: "#64748b" }}>{acc.address}</p>
                    <p style={{ margin: "0 0 0.5rem" }}><FaClock color="#10b981" /> {new Date(acc.check_in).toLocaleString()} - {new Date(acc.check_out).toLocaleString()}</p>
                    {acc.booking_reference && <p style={{ margin: "0 0 0.5rem" }}><strong>Ref:</strong> {acc.booking_reference}</p>}
                    {acc.price && <p style={{ margin: "0 0 0.5rem" }}><FaMoneyBillWave color="#f59e0b" /> ${acc.price}</p>}
                    {acc.contact_number && <p style={{ margin: "0 0 0.5rem" }}><FaPhone color="#64748b" /> {acc.contact_number}</p>}
                  </AccCard>
                ))
              )}
            </AccommodationsList>
          )}

          {activeTab === "add" && (
            <FormContainer onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: "1.5rem" }}>Add Hotel / Lodging</h3>
              <FormGroup>
                <Label>Hotel Name</Label>
                <Input required type="text" name="hotel_name" value={formData.hotel_name} onChange={handleInputChange} />
              </FormGroup>
              <FormGroup>
                <Label>Address</Label>
                <Input type="text" name="address" value={formData.address} onChange={handleInputChange} />
              </FormGroup>
              <div style={{ display: "flex", gap: "1rem" }}>
                <FormGroup style={{ flex: 1 }}>
                  <Label>Check-in</Label>
                  <Input required type="datetime-local" name="check_in" value={formData.check_in} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup style={{ flex: 1 }}>
                  <Label>Check-out</Label>
                  <Input required type="datetime-local" name="check_out" value={formData.check_out} onChange={handleInputChange} />
                </FormGroup>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <FormGroup style={{ flex: 1 }}>
                  <Label>Price ($)</Label>
                  <Input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup style={{ flex: 1 }}>
                  <Label>Booking Ref</Label>
                  <Input type="text" name="booking_reference" value={formData.booking_reference} onChange={handleInputChange} />
                </FormGroup>
              </div>
              <FormGroup>
                <Label>Contact Number</Label>
                <Input type="text" name="contact_number" value={formData.contact_number} onChange={handleInputChange} />
              </FormGroup>
              <FormGroup>
                <Label>Notes</Label>
                <TextArea name="notes" value={formData.notes} onChange={handleInputChange} />
              </FormGroup>
              <Button type="submit"><FaPlus /> Add to Trip</Button>
            </FormContainer>
          )}

          {activeTab === "discover" && (
            <div>
              {loadingHotels ? (
                <div style={{ textAlign: 'center' }}>
                  <LoadingSpinner />
                  <p style={{ color: '#64748b', marginTop: '1rem' }}>Finding the best hotels near you...</p>
                </div>
              ) : hotelsError ? (
                <div style={{ margin: '2rem auto', maxWidth: '600px', padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #fecaca', textAlign: 'center' }}>
                  <FaExclamationTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
                  <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Location Error</h2>
                  <p style={{ color: '#64748b' }}>{hotelsError}</p>
                  <button 
                    onClick={fetchNearbyHotels}
                    style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    Try Again
                  </button>
                </div>
              ) : nearbyHotels.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#fff", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                  <FaBuilding size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ color: "#0f172a", margin: "0 0 0.5rem", fontSize: "1.4rem" }}>No hotels found</h3>
                  <p style={{ color: "#64748b", margin: "0 0 1.5rem" }}>We couldn't find any hotels near your current location.</p>
                </div>
              ) : (
                <Grid>
                  {nearbyHotels.map((place) => (
                    <NearbyPlaceCard 
                      key={place.placeId || place.id} 
                      place={place} 
                      onSelect={() => {}} 
                      onAddToTrip={() => prefillFormWithHotel(place)} 
                      onDirections={() => window.open(`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`, "_blank")}
                      onImageUpload={handleImageUpload}
                    />
                  ))}
                </Grid>
              )}
            </div>
          )}

        </ContentWrapper>
      </MainContent>
    </DashboardContainer>
  );
}

export default AccommodationPage;

