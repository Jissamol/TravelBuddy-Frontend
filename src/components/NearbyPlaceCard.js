import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaMapMarkerAlt, FaStar, FaCity, FaPlus, FaRoute } from "react-icons/fa";

const FALLBACK_PLACE_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='540' viewBox='0 0 800 540'><rect width='800' height='540' fill='%23eef2f7'/><rect x='60' y='60' width='680' height='420' rx='28' fill='%23f8fafc' stroke='%23e2e8f0'/><circle cx='400' cy='220' r='70' fill='%23e2e8f0'/><path d='M300 360h200' stroke='%2394a3b8' stroke-width='12' stroke-linecap='round'/><path d='M260 400h280' stroke='%23cbd5e1' stroke-width='10' stroke-linecap='round'/></svg>";

const PlaceCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 24px -8px rgba(15, 23, 42, 0.25);
    border-color: #cbd5e1;
  }
`;

const CardImageWrap = styled.div`
  position: relative;
  height: 180px;
  width: 100%;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0) 40%, rgba(15, 23, 42, 0.45) 100%);
    pointer-events: none;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
  transition: transform 0.35s ease, opacity 0.45s ease;

  ${PlaceCard}:hover & {
    transform: scale(1.05);
  }
`;

const DistanceBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255,255,255,0.92);
  color: #0f172a;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1;
`;

const CardBody = styled.div`
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const PlaceName = styled.h3`
  margin: 0;
  font-size: 1.15rem;
  color: #0f172a;
  font-weight: 700;
  flex: 1;
  padding-right: 0.5rem;
`;

const RatingBadge = styled.div`
  display: flex;
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
  margin-bottom: 0.75rem;

  svg { color: #94a3b8; }
`;

const PlaceDescription = styled.p`
  color: #475569;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 1.25rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
`;

const ActionBtn = styled.button`
  flex: 1;
  padding: 0.6rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.primary ? `
    background: #eff6ff;
    color: #1e3a8a;
    border: 1px solid #bfdbfe;
    &:hover { background: #dbeafe; }
  ` : `
    background: #ffffff;
    color: #475569;
    border: 1px solid #e2e8f0;
    &:hover { background: #f8fafc; border-color: #cbd5e1; color: #0f172a; }
  `}
`;

function NearbyPlaceCard({
  place,
  onSelect,
  onAddToTrip,
  onDirections,
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (place?.image) {
      console.log("[NearbyPlace] image:", place.image);
    }
  }, [place?.image]);

  const distanceLabel =
    typeof place?.distance === "number" ? `${place.distance.toFixed(1)} km` : "";

  return (
    <PlaceCard onClick={onSelect}>
      <CardImageWrap>
        <CardImage
          src={place?.image}
          alt={place.name}
          loading="lazy"
          $loaded={loaded}
          onLoad={() => setLoaded(true)}
          onError={(event) => {
            event.currentTarget.src = FALLBACK_PLACE_IMAGE;
            setLoaded(true);
          }}
        />
        {distanceLabel && (
          <DistanceBadge>
            <FaMapMarkerAlt color="#1e3a8a" /> {distanceLabel}
          </DistanceBadge>
        )}
      </CardImageWrap>

      <CardBody>
        <CardHeaderRow>
          <PlaceName>{place.name}</PlaceName>
          <RatingBadge>
            <FaStar /> {place.rating || "4.5"}
          </RatingBadge>
        </CardHeaderRow>
        <LocationText>
          <FaCity /> {place.address || "Nearby location"}
        </LocationText>
        <PlaceDescription>
          {place.description || "A great spot to explore near your location."}
        </PlaceDescription>

        <CardActions>
          <ActionBtn
            onClick={(event) => {
              event.stopPropagation();
              onAddToTrip(place);
            }}
          >
            <FaPlus size={12} /> Add to Trip
          </ActionBtn>
          <ActionBtn
            primary
            onClick={(event) => {
              event.stopPropagation();
              onDirections(place);
            }}
          >
            <FaRoute size={12} /> Directions
          </ActionBtn>
        </CardActions>
      </CardBody>
    </PlaceCard>
  );
}

export default NearbyPlaceCard;
