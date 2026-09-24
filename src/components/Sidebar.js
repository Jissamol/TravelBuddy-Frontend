import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaPlane,
  FaChartLine,
  FaPlusCircle,
  FaSignOutAlt,
  FaSuitcaseRolling,
  FaUtensils,
} from "react-icons/fa";

const SidebarContainer = styled.aside`
  width: 250px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: 100vh;
`;

const SidebarBrand = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  margin: 0;
`;

const SidebarMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const SidebarLink = styled.button`
  background: none;
  border: none;
  color: white;
  text-align: left;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const LogoutButton = styled(SidebarLink)`
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
  color: #ffdddd;

  &:hover {
    background: rgba(255, 0, 0, 0.2);
  }
`;

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <SidebarContainer>
      <SidebarBrand>Travel Planner</SidebarBrand>
      <SidebarMenu>
        <SidebarLink onClick={() => navigate("/dashboard")}>
          <FaChartLine /> Dashboard
        </SidebarLink>
        <SidebarLink onClick={() => navigate("/personalize-plan")}>
          <FaPlusCircle /> Add Trip
        </SidebarLink>
        <SidebarLink onClick={() => navigate("/top-itineraries")}>
          <FaPlusCircle /> Itinerary
        </SidebarLink>
        <SidebarLink onClick={() => navigate("/all-itineraries")}>
          <FaPlane /> My Trips
        </SidebarLink>
        <SidebarLink onClick={() => navigate("/food-restaurants")}>
          <FaUtensils /> Food & Restaurants
        </SidebarLink>
      </SidebarMenu>
      <LogoutButton onClick={handleLogout}>
        <FaSignOutAlt /> Sign Out
      </LogoutButton>
    </SidebarContainer>
  );
}

export default Sidebar;
