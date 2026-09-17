import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeDown = keyframes`
  from { opacity: 0; transform: translateY(-16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Page = styled.section`
  min-height: 100vh;
  background: url('https://static.vinwonders.com/production/Phuket-is-one-of-the-best-places-to-travel-in-November.jpg') center/cover no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.75rem;
  color: #18202b;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.35);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    backdrop-filter: blur(6px);
    background: rgba(255, 255, 255, 0.18);
  }
`;

const MainFrame = styled.div`
  width: min(1200px, 90vw);
  min-height: 78vh;
  position: relative;
  z-index: 1;
  border-radius: 26px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(236, 242, 248, 0.82));
  box-shadow: 0 32px 80px rgba(15, 25, 35, 0.2);
  padding: 1.5rem 2.2rem 2.5rem;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 0%, rgba(255, 255, 255, 0.55), transparent 55%);
    pointer-events: none;
  }

  @media (max-width: 900px) {
    padding: 1.25rem 1.6rem 2rem;
  }
`;

const Navbar = styled.nav`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1.2rem;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  animation: ${fadeDown} 0.8s ease;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.35rem;
  color: #18202b;
  text-decoration: none;
`;

const BrandIcon = styled.span`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  font-size: 0.95rem;
  color: rgba(24, 32, 43, 0.68);

  @media (max-width: 900px) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;



const HeroLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 2.5rem;
  margin-top: 2.8rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 1rem 1rem 1.25rem;
  animation: ${fadeUp} 0.9s ease;

  @media (max-width: 900px) {
    padding: 1.5rem 0.5rem 0;
    text-align: center;
    align-items: center;
  }
`;

const HeroTitle = styled.h1`
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-size: clamp(2.6rem, 4.4vw, 4.2rem);
  font-weight: 600;
  letter-spacing: 0.04rem;
  margin: 0;
`;

const HeroText = styled.p`
  color: rgba(24, 32, 43, 0.7);
  font-size: 1.05rem;
  max-width: 470px;
  line-height: 1.7;
  margin: 0;
`;

const SignupRow = styled.form`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.4rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  border: 1px solid rgba(24, 32, 43, 0.12);
  width: min(430px, 100%);

  @media (max-width: 600px) {
    flex-direction: column;
    border-radius: 16px;
    padding: 0.75rem;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #18202b;
  padding: 0.65rem 1rem;
  font-size: 0.95rem;
  outline: none;

  &::placeholder {
    color: rgba(24, 32, 43, 0.5);
  }
`;

const SignupButton = styled(Link)`
  background: #1a2532;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 0.7rem 1.6rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.25);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const CardsColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  perspective: 900px;
  animation: ${slideInRight} 0.9s ease;

  & > *:not(:first-child) {
    margin-left: -18px;
  }

  @media (max-width: 900px) {
    justify-content: center;
    flex-wrap: wrap;
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

const DestinationCard = styled.div`
  width: 135px;
  height: 320px;
  border-radius: 18px;
  background: url(${(props) => props.$image}) center/cover no-repeat;
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: 0 20px 35px rgba(15, 25, 35, 0.25);
  transform: ${(props) => props.$tilt || 'translateY(0)'};
  transform-style: preserve-3d;
  position: relative;
  overflow: hidden;
  transition: transform 0.45s ease, filter 0.45s ease, box-shadow 0.45s ease;
  filter: saturate(1.05);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.2));
  }

  &:hover {
    transform: translateY(-12px) scale(1.02);
    filter: brightness(1.12) saturate(1.1);
    box-shadow: 0 28px 45px rgba(15, 25, 35, 0.35);
  }

  @media (max-width: 1100px) {
    width: 115px;
    height: 290px;
  }
`;

const SocialRow = styled.div`
  position: absolute;
  right: 2.2rem;
  bottom: 1.8rem;
  display: flex;
  gap: 0.55rem;
  z-index: 2;

  @media (max-width: 900px) {
    position: static;
    justify-content: center;
    margin-top: 1.5rem;
  }
`;

const SocialIcon = styled.a`
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid rgba(24, 32, 43, 0.2);
  background: rgba(255, 255, 255, 0.65);
  color: #18202b;
  text-decoration: none;
  font-size: 0.85rem;
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(24, 32, 43, 0.08);
  }
`;

function Home() {
  return (
    <Page aria-label="Travel Buddy landing page">
      <MainFrame>
        <Navbar>
          <Brand to="/">
            <BrandIcon aria-hidden="true"></BrandIcon>
            TRAVEL
          </Brand>
          <NavLinks>
            {/* <NavLink className="active" href="#home">Home</NavLink> */}
           
          </NavLinks>
          
        </Navbar>

        <HeroLayout>
          <HeroContent>
            <HeroTitle>Travel Discover</HeroTitle>
            <HeroText>
              If you are looking for inspiration and authentic holiday experiences tailored
              to your needs, you've come to the right place.
            </HeroText>
            <SignupRow>
              <EmailInput type="email" placeholder="Enter Your Email" />
              <SignupButton to="/login">Get Started</SignupButton>
            </SignupRow>
          </HeroContent>

          <CardsColumn aria-label="Featured destinations">
            <DestinationCard
              $image="https://preview.redd.it/15-best-places-to-travel-in-kerala-the-ultimate-guide-v0-174j4tunclxf1.png?width=1169&format=png&auto=webp&s=09064b92c27724ca61c9ba5520ba69727b857a43"
              $tilt="translateY(12px) rotateY(-10deg)"
            />
            <DestinationCard
              $image="https://preview.redd.it/15-best-places-to-travel-in-kerala-the-ultimate-guide-v0-39chu7ikclxf1.png?width=1207&format=png&auto=webp&s=ae270511153fce373c979b0ab3c255bb3df8422f"
              $tilt="translateY(-10px) rotateY(-6deg)"
            />
            <DestinationCard
              $image="https://s7ap1.scene7.com/is/image/incredibleindia/80-Places-to-Visit-Near-Delhi-To-Gain-Some-Unforgettable-Experience14-about?qlt=82&ts=1742170536737"
              $tilt="translateY(6px) rotateY(6deg)"
            />
            <DestinationCard
              $image="https://luggageandlipstick.com/wp-content/uploads/2021/02/bagan_Patti-Morrow_luggageandlipstick.com_.jpg"
              $tilt="translateY(-14px) rotateY(10deg)"
            />
          </CardsColumn>
        </HeroLayout>

        <SocialRow aria-label="Social links">
          <SocialIcon href="https://www.facebook.com" aria-label="Facebook">f</SocialIcon>
          <SocialIcon href="https://www.x.com" aria-label="X">x</SocialIcon>
          <SocialIcon href="https://www.pinterest.com" aria-label="Pinterest">p</SocialIcon>
          <SocialIcon href="https://www.youtube.com" aria-label="YouTube">yt</SocialIcon>
        </SocialRow>
      </MainFrame>
    </Page>
  );
}

export default Home;
