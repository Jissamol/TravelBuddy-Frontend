import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaRoute,
  FaArrowLeft,
  FaExclamationTriangle,
  FaEye,
  FaChevronRight,
  FaBell,
  FaUserCircle
} from "react-icons/fa";
import Sidebar from "./Sidebar";

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

const CreateButton = styled.button`
  background: #1e3a8a;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(30, 58, 138, 0.2);
  transition: all 0.2s ease;
  &:hover {
    background: #1e40af;
  }
`;

const ContentWrapper = styled.div`
  padding: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const TripCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 24px -8px rgba(15, 23, 42, 0.25);
    border-color: #cbd5e1;
  }
`;

const CardImageWrap = styled.div`
  position: relative;
  height: 160px;
  width: 100%;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0) 40%, rgba(15, 23, 42, 0.6) 100%);
    pointer-events: none;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;

  ${TripCard}:hover & {
    transform: scale(1.05);
  }
`;

const CardBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TripLocations = styled.div`
  margin-bottom: 1.2rem;
`;

const LocationText = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
  line-height: 1.3;
  
  svg {
    color: #1e3a8a;
    font-size: 1rem;
  }
`;

const RouteDivider = styled.div`
  color: #94a3b8;
  margin: 0 0.5rem 0.4rem 0.5rem;
  font-size: 0.9rem;
`;

const DateText = styled.div`
  color: #64748b;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  
  &.view {
    background: #eff6ff;
    color: #1e40af;
    &:hover { background: #dbeafe; }
  }
  &.edit {
    background: #f8fafc;
    color: #475569;
    border-color: #e2e8f0;
    &:hover { background: #f1f5f9; }
  }
  &.delete {
    background: #fef2f2;
    color: #b91c1c;
    &:hover { background: #fee2e2; }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
  
  label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 600;
    color: #334155;
    font-size: 0.9rem;
  }
  
  input {
    width: 100%;
    padding: 0.7rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.95rem;
    color: #0f172a;
    transition: all 0.2s;
    &:focus {
      border-color: #1e3a8a;
      box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
      outline: none;
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  
  button {
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    
    &.cancel {
      background: #f1f5f9;
      color: #475569;
      &:hover { background: #e2e8f0; }
    }
    
    &.save {
      background: #1e3a8a;
      color: white;
      &:hover { background: #1e40af; }
    }
  }
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

const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80"
];

function AllItinerariesPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [editForm, setEditForm] = useState({ start_location: '', destination: '' });

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("http://localhost:8000/api/travel/plans/", { headers });
      if (res.status === 401) {
        localStorage.removeItem("access");
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to load trips.");
      const data = await res.json();
      setTrips(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      const token = localStorage.getItem("access");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      
      const res = await fetch(`http://localhost:8000/api/travel/plans/${planId}/`, {
        method: "DELETE",
        headers
      });
      if (!res.ok) throw new Error("Failed to delete trip.");
      
      setTrips(trips.filter(t => t.id !== planId));
    } catch (err) {
      alert(err.message);
    }
  };

  const openEditModal = (trip) => {
    setEditingTrip(trip);
    setEditForm({ start_location: trip.startLocation, destination: trip.destination });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      
      const res = await fetch(`http://localhost:8000/api/travel/plans/${editingTrip.id}/`, {
        method: "PUT",
        headers,
        body: JSON.stringify(editForm)
      });
      if (!res.ok) throw new Error("Failed to update trip.");
      
      const updatedTrip = await res.json();
      setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
      setEditModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
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
              <span className="active">My Trips</span>
            </Breadcrumb>
          </HeaderLeft>
          <HeaderRight>
            <FaUserCircle size={28} />
          </HeaderRight>
        </TopNav>

        {/* Page Header Toolbar */}
        <PageHeader>
          <TitleGroup>
            <PageTitle>My Trips</PageTitle>
            <PageSubtitle>Manage all your travel plans in one place</PageSubtitle>
          </TitleGroup>
          <CreateButton onClick={() => navigate("/personalize-plan")}>
            <FaPlus size={14} /> Create New Trip
          </CreateButton>
        </PageHeader>

        <ContentWrapper>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div style={{ margin: '2rem auto', maxWidth: '600px', padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #fecaca', textAlign: 'center' }}>
              <FaExclamationTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
              <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Oops!</h2>
              <p style={{ color: '#64748b' }}>{error}</p>
            </div>
          ) : trips.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#fff", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
              <h3 style={{ color: "#0f172a", margin: "0 0 0.5rem", fontSize: "1.4rem" }}>No trips found</h3>
              <p style={{ color: "#64748b", margin: "0 0 1.5rem" }}>You haven't created any trips yet.</p>
              <CreateButton style={{ margin: "0 auto" }} onClick={() => navigate("/personalize-plan")}>
                <FaPlus size={14} /> Create Your First Trip
              </CreateButton>
            </div>
          ) : (
            <Grid>
              {trips.map((trip, idx) => {
                const coverImg = COVER_IMAGES[idx % COVER_IMAGES.length];
                return (
                <TripCard key={trip.id}>
                  <CardImageWrap>
                    <CardImage src={coverImg} alt="Trip cover" />
                  </CardImageWrap>
                  
                  <CardBody>
                    <TripLocations>
                      <LocationText>
                        <FaMapMarkerAlt /> {trip.startLocation}
                      </LocationText>
                      <RouteDivider>
                        <FaRoute />
                      </RouteDivider>
                      <LocationText>
                        <FaMapMarkerAlt style={{ color: '#0f172a' }} /> {trip.destination}
                      </LocationText>
                    </TripLocations>
                    
                    <DateText>
                      <FaCalendarAlt /> Created: {new Date(trip.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </DateText>
                    
                    <Actions>
                      <ActionButton className="view" onClick={() => navigate(`/plans/${trip.id}/itineraries`, { state: { plan_id: trip.id } })}>
                        <FaEye /> View
                      </ActionButton>
                      <ActionButton className="edit" onClick={() => openEditModal(trip)}>
                        <FaEdit /> Edit
                      </ActionButton>
                      <ActionButton className="delete" onClick={() => handleDelete(trip.id)}>
                        <FaTrash /> Delete
                      </ActionButton>
                    </Actions>
                  </CardBody>
                </TripCard>
                );
              })}
            </Grid>
          )}
        </ContentWrapper>
      </MainContent>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <ModalOverlay onClick={() => setEditModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 1.5rem', color: '#0f172a', fontSize: '1.4rem' }}>Edit Trip</h2>
            <FormGroup>
              <label>Start Location</label>
              <input 
                value={editForm.start_location}
                onChange={e => setEditForm({...editForm, start_location: e.target.value})}
              />
            </FormGroup>
            <FormGroup>
              <label>Destination</label>
              <input 
                value={editForm.destination}
                onChange={e => setEditForm({...editForm, destination: e.target.value})}
              />
            </FormGroup>
            <ModalActions>
              <button className="cancel" onClick={() => setEditModalOpen(false)}>Cancel</button>
              <button className="save" onClick={handleUpdate}>Save Changes</button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </DashboardContainer>
  );
}

export default AllItinerariesPage;