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
  FaPhone
} from "react-icons/fa";
import Sidebar from "./Sidebar";

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
  gap: 2rem;
  flex-wrap: wrap;
`;

const SelectBox = styled.select`
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  width: 300px;
  margin-bottom: 2rem;
  background: #fff;
  outline: none;
`;

const FormContainer = styled.form`
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 400px;
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
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AccCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3b82f6;
`;

function AccommodationPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [accommodations, setAccommodations] = useState([]);

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
      } else {
        alert("Failed to add accommodation.");
      }
    } catch (err) {
      console.error(err);
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

          <AccommodationsList>
            <h3 style={{ marginBottom: "1.5rem" }}>Saved Accommodations</h3>
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

        </ContentWrapper>
      </MainContent>
    </DashboardContainer>
  );
}

export default AccommodationPage;
