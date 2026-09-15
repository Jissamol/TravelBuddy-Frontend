import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaTimes, FaGlobe, FaLock, FaCopy, FaCheck, FaUserPlus, FaUsers } from "react-icons/fa";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  width: 100%;
  max-width: 450px;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  position: relative;
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #0f172a; }
`;

const Title = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.div`
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
`;

const VisibilityToggle = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 0.4rem;
  border-radius: 12px;
  gap: 0.4rem;
`;

const ToggleBtn = styled.button`
  flex: 1;
  padding: 0.6rem;
  border-radius: 8px;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  background: ${props => props.active ? "#fff" : "transparent"};
  color: ${props => props.active ? "#7c5cff" : "#64748b"};
  box-shadow: ${props => props.active ? "0 2px 8px rgba(0,0,0,0.05)" : "none"};
`;

const LinkBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const LinkText = styled.div`
  flex: 1;
  font-size: 0.85rem;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: monospace;
`;

const CopyBtn = styled.button`
  background: #7c5cff;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #6a4deb; transform: scale(1.05); }
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 150px;
  overflow-y: auto;
  margin-top: 1rem;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
  color: #64748b;
  border: 2px solid white;
`;

const MemberName = styled.div`
  font-size: 0.9rem;
  color: #334155;
  span { color: #94a3b8; font-size: 0.8rem; margin-left: 0.5rem; }
`;

function ShareModal({ onClose, trip, onTogglePublic }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/join/${trip.share_token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        
        <Title><FaUserPlus /> Share Trip</Title>
        <Subtitle>Invite friends to collaborate or share as read-only.</Subtitle>

        <Section>
          <Label>Visibility</Label>
          <VisibilityToggle>
            <ToggleBtn 
              active={!trip.is_public} 
              onClick={() => onTogglePublic(false)}
            >
              <FaLock /> Private
            </ToggleBtn>
            <ToggleBtn 
              active={trip.is_public} 
              onClick={() => onTogglePublic(true)}
            >
              <FaGlobe /> Public
            </ToggleBtn>
          </VisibilityToggle>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            {trip.is_public 
              ? "Anyone with the link can view this trip." 
              : "Only collaborators can view or edit this trip."}
          </p>
        </Section>

        <Section>
          <Label>Invite Link</Label>
          <LinkBox>
            <LinkText>{shareUrl}</LinkText>
            <CopyBtn onClick={handleCopy}>
              {copied ? <FaCheck /> : <FaCopy />}
            </CopyBtn>
          </LinkBox>
        </Section>

        <Section style={{ marginBottom: 0 }}>
          <Label><FaUsers style={{ marginRight: '0.5rem' }} /> Collaborators</Label>
          <MemberList>
            <MemberItem>
              <Avatar style={{ background: '#7c5cff', color: 'white' }}>
                {trip.collaborators_details?.[0]?.username?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <MemberName>You <span>(Owner)</span></MemberName>
            </MemberItem>
            {trip.collaborators_details?.slice(1).map(member => (
              <MemberItem key={member.id}>
                <Avatar>{member.username[0].toUpperCase()}</Avatar>
                <MemberName>{member.username}</MemberName>
              </MemberItem>
            ))}
            {(!trip.collaborators_details || trip.collaborators_details.length <= 1) && (
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.5rem 0' }}>
                No collaborators yet. Share the link to invite others!
              </p>
            )}
          </MemberList>
        </Section>
      </ModalCard>
    </Overlay>
  );
}

export default ShareModal;
