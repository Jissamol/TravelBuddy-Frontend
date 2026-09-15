import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaUserPlus, FaSuitcaseRolling, FaSpinner, FaArrowRight } from "react-icons/fa";
import Sidebar from "./Sidebar";

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #f4f9fc;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const IconCircle = styled.div`
  width: 80px;
  height: 80px;
  background: #f0edff;
  color: #7c5cff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 2rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: #0f172a;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2.5rem;
`;

const Button = styled.button`
  background: #7c5cff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  transition: all 0.2s;
  
  &:hover {
    background: #6a4deb;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(124, 92, 255, 0.2);
  }
  
  &:disabled {
    background: #e2e8f0;
    cursor: not-allowed;
  }
`;

const LoginHint = styled.div`
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #94a3b8;
  
  a {
    color: #7c5cff;
    text-decoration: none;
    font-weight: 600;
    margin-left: 0.5rem;
  }
`;

function TripJoinPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const isAuthenticated = !!localStorage.getItem("access");

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/travel/trips/token/${token}/`);
        if (!response.ok) throw new Error("Invalid or expired invite link.");
        const data = await response.json();
        setTrip(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [token]);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate(`/login?next=/join/${token}`);
      return;
    }

    setJoining(true);
    try {
      const response = await fetch(`http://localhost:8000/api/travel/trips/join/${token}/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) throw new Error("Failed to join trip.");
      
      const data = await response.json();
      navigate("/itinerary", { state: { plan_id: data.id } });
    } catch (err) {
      alert(err.message);
    } finally {
      setJoining(false);
    }
  };

  const handleViewPublic = () => {
    navigate("/itinerary", { state: { token: token } });
  };

  if (loading) {
    return (
      <PageContainer>
        <Sidebar />
        <Content>
          <FaSpinner className="spin" style={{ fontSize: '3rem', color: '#7c5cff' }} />
        </Content>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Sidebar />
      <Content>
        <Card>
          <IconCircle>
            {error ? <FaSuitcaseRolling style={{ opacity: 0.3 }} /> : <FaUserPlus />}
          </IconCircle>
          
          {error ? (
            <>
              <Title>Invite Not Found</Title>
              <Subtitle>{error}</Subtitle>
              <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
            </>
          ) : (
            <>
              <Title>You're Invited!</Title>
              <Subtitle>
                Someone invited you to join their trip to <strong>{trip.destination}</strong>. 
                Join as a collaborator to edit the itinerary and pack together!
              </Subtitle>

              <Button onClick={handleJoin} disabled={joining}>
                {joining ? <FaSpinner className="spin" /> : <><FaUserPlus /> Join as Collaborator</>}
              </Button>

              {trip.is_public && (
                <Button 
                  style={{ background: 'transparent', color: '#64748b', marginTop: '1rem', border: '1px solid #e2e8f0' }}
                  onClick={handleViewPublic}
                >
                  View as Guest <FaArrowRight style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }} />
                </Button>
              )}

              {!isAuthenticated && (
                <LoginHint>
                  Already have an account? <a href="/login">Sign In</a>
                </LoginHint>
              )}
            </>
          )}
        </Card>
      </Content>
    </PageContainer>
  );
}

export default TripJoinPage;
