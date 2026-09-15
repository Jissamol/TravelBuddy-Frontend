import React from "react";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -450px 0; }
  100% { background-position: 450px 0; }
`;

const ShimmerWrapper = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  overflow: hidden;
`;

const ShimmerBlock = styled.div`
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

const ImageBlock = styled(ShimmerBlock)`
  height: 180px;
`;

const ContentBlock = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Line = styled(ShimmerBlock)`
  height: 14px;
  border-radius: 999px;
`;

const ShortLine = styled(Line)`
  width: 60%;
`;

function ShimmerCard() {
  return (
    <ShimmerWrapper>
      <ImageBlock />
      <ContentBlock>
        <Line />
        <ShortLine />
        <Line style={{ height: 10 }} />
        <ShortLine style={{ width: "75%", height: 10 }} />
      </ContentBlock>
    </ShimmerWrapper>
  );
}

export default ShimmerCard;
