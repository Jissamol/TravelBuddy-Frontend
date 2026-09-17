import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaPlus, FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaClipboardList, FaRoute } from "react-icons/fa";
import Sidebar from "./Sidebar";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MainContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

const PageContainer = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 30px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 600px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const BackButton = styled.button`
  background: transparent;
  color: #4a5568;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.2s;
  &:hover {
    color: #667eea;
    transform: translateX(-5px);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h2`
  color: #1a202c;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #718096;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  color: #a0aec0;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
  outline: none;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }
`;

const TimeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
  transition: all 0.3s;
  box-shadow: 0 10px 15px -3px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

function AddItineraryPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    day_number: "1",
    activity: "",
    location: "",
    start_time: "",
    end_time: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("access");
    try {
      const res = await fetch(`http://localhost:8000/api/travel/plans/${planId}/itineraries/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add itinerary");
      navigate(`/itinerary`, { state: { plan_id: planId } });
    } catch (err) {
      console.error(err);
      alert("Error adding activity. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContainer>
      <Sidebar />
      <PageContainer>
        <ContentCard>
          <BackButton onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </BackButton>
          
          <Header>
            <Title>Add Activity</Title>
            <Subtitle>Add a new stop to your trip plan #{planId}</Subtitle>
          </Header>

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label><FaCalendarAlt /> Day Number</Label>
              <InputWrapper>
                <IconWrapper><FaClipboardList /></IconWrapper>
                <StyledInput
                  type="number"
                  name="day_number"
                  min="1"
                  placeholder="Which day of the trip?"
                  value={formData.day_number}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label><FaPlus /> Activity Name</Label>
              <InputWrapper>
                <IconWrapper><FaRoute /></IconWrapper>
                <StyledInput
                  type="text"
                  name="activity"
                  placeholder="e.g., Visit Eiffel Tower"
                  value={formData.activity}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label><FaMapMarkerAlt /> Location</Label>
              <InputWrapper>
                <IconWrapper><FaMapMarkerAlt /></IconWrapper>
                <StyledInput
                  type="text"
                  name="location"
                  placeholder="e.g., Paris, France"
                  value={formData.location}
                  onChange={handleChange}
                />
              </InputWrapper>
            </InputGroup>

            <TimeRow>
              <InputGroup>
                <Label><FaClock /> Start Time</Label>
                <InputWrapper>
                  <IconWrapper><FaClock /></IconWrapper>
                  <StyledInput
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <Label><FaClock /> End Time</Label>
                <InputWrapper>
                  <IconWrapper><FaClock /></IconWrapper>
                  <StyledInput
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                  />
                </InputWrapper>
              </InputGroup>
            </TimeRow>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Adding..." : <><FaPlus /> Add to Itinerary</>}
            </SubmitButton>
          </Form>
        </ContentCard>
      </PageContainer>
    </MainContainer>
  );
}

export default AddItineraryPage;
