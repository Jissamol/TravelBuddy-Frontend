import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import {
  FaCheck,
  FaPlus,
  FaArrowLeft,
  FaSpinner,
  FaSearch,
  FaCloudSunRain,
  FaTemperatureHigh,
  FaTemperatureLow,
  FaWind,
  FaTint,
  FaSnowflake,
  FaUmbrella,
  FaSun,
  FaCloud,
  FaChevronDown,
  FaChevronRight,
  FaSuitcaseRolling,
  FaMapMarkerAlt,
  FaPrint,
  FaTrashAlt,
} from "react-icons/fa";
import Sidebar from "./Sidebar";

// ==================== ANIMATIONS ====================
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const checkPop = keyframes`
  0% { transform: scale(0.8); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const slideDown = keyframes`
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 2000px; }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(124, 92, 255, 0); }
  50% { box-shadow: 0 0 0 6px rgba(124, 92, 255, 0.15); }
`;

// ==================== STYLED COMPONENTS ====================
const MainContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f4f6fb;
`;

const PageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem 2.5rem;
  animation: ${fadeUp} 0.5s ease-out;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackBtn = styled.button`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    border-color: #7c5cff;
    color: #7c5cff;
    transform: translateX(-2px);
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  color: #2f3142;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

// Weather Card
const WeatherCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 1.75rem 2rem;
  margin-bottom: 2rem;
  color: white;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  box-shadow: 0 10px 35px rgba(102, 126, 234, 0.3);
  animation: ${fadeUp} 0.6s ease-out 0.1s both;
`;

const WeatherLeft = styled.div`
  flex: 1;
  min-width: 200px;
`;

const WeatherDestination = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
`;



const WeatherStats = styled.div`
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
`;

const WeatherStat = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 0.75rem 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  min-width: 80px;

  .stat-icon {
    font-size: 1.2rem;
  }

  .stat-value {
    font-size: 1.1rem;
    font-weight: 700;
  }

  .stat-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.8;
  }
`;

const ConditionBadges = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const ConditionBadge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
`;

// Progress Bar
const ProgressSection = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  animation: ${fadeUp} 0.6s ease-out 0.2s both;
`;

const ProgressInfo = styled.div`
  flex: 1;
  min-width: 200px;
`;

const ProgressLabel = styled.div`
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 0.4rem;
  font-weight: 600;
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 10px;
  background: #edf2f7;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #7c5cff, #667eea);
  border-radius: 10px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: ${({ percent }) => percent}%;
`;

const ProgressCount = styled.div`
  font-size: 1.6rem;
  font-weight: 800;
  color: #7c5cff;
  white-space: nowrap;
`;

// Toolbar
const Toolbar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  animation: ${fadeUp} 0.6s ease-out 0.3s both;
`;

const SearchBox = styled.div`
  flex: 1;
  min-width: 200px;
  position: relative;

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #a0aec0;
    font-size: 0.9rem;
  }

  input {
    width: 100%;
    padding: 0.7rem 0.7rem 0.7rem 2.5rem;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-size: 0.9rem;
    color: #2f3142;
    box-sizing: border-box;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #7c5cff;
    }
    &::placeholder {
      color: #a0aec0;
    }
  }
`;

const ToolBtn = styled.button`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.7rem 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    border-color: #7c5cff;
    color: #7c5cff;
  }
`;

// Category Section
const CategorySection = styled.div`
  background: #fff;
  border-radius: 18px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: ${fadeUp} 0.5s ease-out ${({ index }) => 0.3 + index * 0.08}s both;
`;

const CategoryHeader = styled.button`
  width: 100%;
  padding: 1.1rem 1.5rem;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #fafbfe;
  }
`;

const CategoryEmoji = styled.span`
  font-size: 1.4rem;
  width: 40px;
  height: 40px;
  background: ${({ bg }) => bg || "#f0edff"};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoryName = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  color: #2f3142;
  flex: 1;
  text-align: left;
`;

const CategoryCount = styled.span`
  font-size: 0.82rem;
  color: #a0aec0;
  font-weight: 600;
`;

const CategoryChevron = styled.span`
  color: #a0aec0;
  transition: transform 0.3s;
  display: flex;
  ${({ open }) => open && "transform: rotate(0deg);"}
`;

const CategoryItems = styled.div`
  padding: 0 1rem 0.75rem;
  animation: ${slideDown} 0.3s ease-out;
`;

// Item Row
const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.75rem;
  border-radius: 12px;
  transition: background 0.15s;
  cursor: pointer;

  &:hover {
    background: #fafbfe;
  }

  ${({ checked }) =>
    checked &&
    css`
      opacity: 0.55;
    `}
`;

const Checkbox = styled.div`
  width: 22px;
  height: 22px;
  min-width: 22px;
  border-radius: 7px;
  border: 2px solid ${({ checked }) => (checked ? "#7c5cff" : "#cbd5e0")};
  background: ${({ checked }) => (checked ? "#7c5cff" : "transparent")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: white;
  font-size: 0.7rem;

  ${({ checked }) =>
    checked &&
    css`
      animation: ${checkPop} 0.3s ease-out;
    `}
`;

const ItemEmoji = styled.span`
  font-size: 1.15rem;
  width: 28px;
  text-align: center;
`;

const ItemName = styled.span`
  font-size: 0.92rem;
  font-weight: 600;
  color: ${({ checked }) => (checked ? "#a0aec0" : "#2f3142")};
  text-decoration: ${({ checked }) => (checked ? "line-through" : "none")};
  flex: 1;
`;

const WeatherTag = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  color: #667eea;
  background: #eef0ff;
  padding: 0.2rem 0.55rem;
  border-radius: 8px;
  white-space: nowrap;
  animation: ${pulseGlow} 2s infinite;
`;

const ItemReason = styled.span`
  font-size: 0.75rem;
  color: #a0aec0;
  max-width: 200px;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    display: none;
  }
`;

const DeleteItemBtn = styled.button`
  background: none;
  border: none;
  color: #e2e8f0;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 0.75rem;
  opacity: 0;
  transition: all 0.2s;

  ${ItemRow}:hover & {
    opacity: 1;
  }

  &:hover {
    color: #e53e3e;
  }
`;

// Add Item
const AddItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  margin-top: 0.25rem;
`;

const AddItemInput = styled.input`
  flex: 1;
  padding: 0.55rem 0.75rem;
  border: 1px dashed #cbd5e0;
  border-radius: 10px;
  font-size: 0.88rem;
  color: #2f3142;
  background: #fafbfe;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #7c5cff;
    border-style: solid;
  }
  &::placeholder {
    color: #a0aec0;
  }
`;

const AddItemBtn = styled.button`
  background: #7c5cff;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;

  &:hover {
    background: #6a4deb;
    transform: scale(1.05);
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
`;

// Loading
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1.5rem;
  color: #4a5568;
`;

const LoadingSpinner = styled(FaSpinner)`
  font-size: 2.5rem;
  color: #7c5cff;
  animation: spin 1s linear infinite;
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Category icons / colors mapping
const CATEGORY_CONFIG = {
  Essentials: { emoji: "🎒", bg: "#fff3e0" },
  Documents: { emoji: "📑", bg: "#e3f2fd" },
  Clothing: { emoji: "👔", bg: "#fce4ec" },
  "Weather Gear": { emoji: "⛈️", bg: "#e8eaf6" },
  Toiletries: { emoji: "🧴", bg: "#e0f7fa" },
  Electronics: { emoji: "📱", bg: "#f3e5f5" },
};

const getWeatherIcon = (conditions) => {
  if (!conditions || conditions.length === 0) return <FaSun />;
  const c = conditions.map((c) => c.toLowerCase());
  if (c.includes("snow")) return <FaSnowflake />;
  if (c.includes("rain") || c.includes("drizzle") || c.includes("thunderstorm"))
    return <FaUmbrella />;
  if (c.includes("clouds")) return <FaCloud />;
  return <FaSun />;
};

// ==================== COMPONENT ====================
function PackingChecklist() {
  const location = useLocation();
  const navigate = useNavigate();

  // Trip data from navigation state
  const {
    destination = "",
    destCoords = {},
    plan_id = null,
  } = location.state || {};

  const [items, setItems] = useState([]);
  const [weatherSummary, setWeatherSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [newItemTexts, setNewItemTexts] = useState({});
  const [saveTimeout, setSaveTimeout] = useState(null);

  // Derived state: categories and stats
  const { categories, stats } = useMemo(() => {
    const cats = {};
    let total = 0;
    let weatherBased = 0;

    items.forEach((item) => {
      if (!cats[item.category]) {
        cats[item.category] = [];
      }
      cats[item.category].push(item);
      total++;
      if (item.is_weather_based) weatherBased++;
    });

    return {
      categories: cats,
      stats: {
        total,
        weather_based: weatherBased,
        categories: Object.keys(cats).length,
      },
    };
  }, [items]);

  // Load checklist
  useEffect(() => {
    const fetchChecklist = async () => {
      if (!destination && !destCoords?.lat) {
        setError("No trip data found. Please create a trip first.");
        setLoading(false);
        return;
      }

      try {
        const lat = destCoords?.lat || destCoords?.latitude;
        const lon = destCoords?.lon || destCoords?.longitude;

        if (!lat || !lon) {
          // Try to geocode the destination
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`
          );
          const geoData = await geoRes.json();
          if (geoData && geoData.length > 0) {
            await generateChecklist(geoData[0].lat, geoData[0].lon);
          } else {
            setError("Could not find destination coordinates.");
            setLoading(false);
          }
          return;
        }

        await generateChecklist(lat, lon);
      } catch (err) {
        console.error("Error loading checklist:", err);
        setError("Failed to generate packing checklist. Please try again.");
        setLoading(false);
      }
    };

    fetchChecklist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateChecklist = async (lat, lon) => {
    try {
      const token = localStorage.getItem("access");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const payload = {
        dest_lat: lat,
        dest_lon: lon,
        destination: destination,
        plan_id: plan_id,
      };

      const response = await fetch("http://localhost:8000/api/travel/packing-checklist/", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setItems(data.items || []);
      setWeatherSummary(data.weather_summary || data.weatherSummary || null);
    } catch (err) {
      console.error("Error generating checklist:", err);
      setError("Failed to generate packing checklist.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle item check
  const toggleItem = useCallback(
    (itemName) => {
      setItems((prev) => {
        const updated = prev.map((item) =>
          item.name === itemName ? { ...item, checked: !item.checked } : item
        );

        // Debounced save
        if (plan_id) {
          if (saveTimeout) clearTimeout(saveTimeout);
          const timeout = setTimeout(() => {
            autoSave(updated);
          }, 1500);
          setSaveTimeout(timeout);
        }

        return updated;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plan_id, saveTimeout]
  );

  // Auto-save to backend
  const autoSave = async (updatedItems) => {
    try {
      const token = localStorage.getItem("access");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch(`http://localhost:8000/api/travel/packing-checklist/${plan_id}/`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ items: updatedItems }),
      });
    } catch (err) {
      console.error("Error auto-saving:", err);
    }
  };

  // Add custom item to a category
  const addCustomItem = (category) => {
    const text = (newItemTexts[category] || "").trim();
    if (!text) return;

    const newItem = {
      name: text,
      category: category,
      emoji: "📦",
      reason: "Custom item",
      is_weather_based: false,
      checked: false,
    };

    setItems((prev) => {
      const updated = [...prev, newItem];
      
      // Auto-save
      if (plan_id) {
        if (saveTimeout) clearTimeout(saveTimeout);
        const timeout = setTimeout(() => {
          autoSave(updated);
        }, 1000);
        setSaveTimeout(timeout);
      }
      
      return updated;
    });

    setNewItemTexts((prev) => ({ ...prev, [category]: "" }));
  };

  // Delete a custom item
  const deleteItem = (itemName) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.name !== itemName);
      
      // Auto-save
      if (plan_id) {
        if (saveTimeout) clearTimeout(saveTimeout);
        const timeout = setTimeout(() => {
          autoSave(updated);
        }, 1000);
        setSaveTimeout(timeout);
      }
      
      return updated;
    });
  };

  // Toggle category collapse
  const toggleCategory = (cat) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Computed values
  const checkedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Filter items by search
  const getFilteredItems = (categoryItems) => {
    if (!searchQuery) return categoryItems;
    return categoryItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Print
  const handlePrint = () => window.print();


  // ============ RENDER ============
  if (loading) {
    return (
      <MainContainer>
        <Sidebar />
        <PageContainer>
          <LoadingContainer>
            <LoadingSpinner />
            <h2 style={{ margin: 0, color: "#2f3142" }}>Analyzing weather & generating your packing list...</h2>
            <p style={{ color: "#718096", margin: 0 }}>Fetching forecast for {destination || "your destination"}</p>
          </LoadingContainer>
        </PageContainer>
      </MainContainer>
    );
  }

  if (error) {
    return (
      <MainContainer>
        <Sidebar />
        <PageContainer>
          <TopBar>
            <BackBtn onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back
            </BackBtn>
          </TopBar>
          <LoadingContainer>
            <FaCloudSunRain style={{ fontSize: "3rem", color: "#cbd5e0" }} />
            <h2 style={{ margin: 0, color: "#2f3142" }}>{error}</h2>
            <BackBtn onClick={() => navigate("/personalize-plan")} style={{ marginTop: "1rem" }}>
              Create a Trip First
            </BackBtn>
          </LoadingContainer>
        </PageContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Sidebar />
      <PageContainer>
        {/* Top Bar */}
        <TopBar>
          <BackBtn onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </BackBtn>
          <PageTitle>
            <FaSuitcaseRolling /> Smart Packing List
          </PageTitle>
        </TopBar>

        {/* Weather Card */}
        {weatherSummary && (
          <WeatherCard>
            <WeatherLeft>
              <WeatherDestination>
                <FaMapMarkerAlt style={{ marginRight: "0.4rem", fontSize: "1rem" }} />
                {weatherSummary.destination || destination}
              </WeatherDestination>

              <ConditionBadges>
                {(weatherSummary.conditions || []).map((c, i) => (
                  <ConditionBadge key={i}>{c}</ConditionBadge>
                ))}
              </ConditionBadges>
            </WeatherLeft>
            <WeatherStats>
              <WeatherStat>
                <span className="stat-icon">
                  {getWeatherIcon(weatherSummary.conditions)}
                </span>
                <span className="stat-value">{weatherSummary.avg_temp || weatherSummary.avgTemp}°</span>
                <span className="stat-label">Avg Temp</span>
              </WeatherStat>
              <WeatherStat>
                <span className="stat-icon"><FaTemperatureLow /></span>
                <span className="stat-value">{weatherSummary.min_temp || weatherSummary.minTemp}°</span>
                <span className="stat-label">Min</span>
              </WeatherStat>
              <WeatherStat>
                <span className="stat-icon"><FaTemperatureHigh /></span>
                <span className="stat-value">{weatherSummary.max_temp || weatherSummary.maxTemp}°</span>
                <span className="stat-label">Max</span>
              </WeatherStat>
              <WeatherStat>
                <span className="stat-icon"><FaTint /></span>
                <span className="stat-value">{weatherSummary.rain_chance || weatherSummary.rainChance}%</span>
                <span className="stat-label">Rain</span>
              </WeatherStat>
              <WeatherStat>
                <span className="stat-icon"><FaWind /></span>
                <span className="stat-value">{weatherSummary.max_wind_speed || weatherSummary.maxWindSpeed}</span>
                <span className="stat-label">km/h</span>
              </WeatherStat>
              <WeatherStat>
                <span className="stat-icon"><FaTint /></span>
                <span className="stat-value">{weatherSummary.avg_humidity || weatherSummary.avgHumidity}%</span>
                <span className="stat-label">Humidity</span>
              </WeatherStat>
            </WeatherStats>
          </WeatherCard>
        )}

        {/* Progress Bar */}
        <ProgressSection>
          <ProgressInfo>
            <ProgressLabel>
              Packing Progress — {stats.weather_based || stats.weatherBased || 0} weather-based items
            </ProgressLabel>
            <ProgressBarTrack>
              <ProgressBarFill percent={progressPercent} />
            </ProgressBarTrack>
          </ProgressInfo>
          <ProgressCount>
            {checkedCount}/{totalCount}
          </ProgressCount>
        </ProgressSection>

        {/* Toolbar */}
        <Toolbar>
          <SearchBox>
            <FaSearch />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
          <ToolBtn onClick={handlePrint}>
            <FaPrint /> Print
          </ToolBtn>
        </Toolbar>

        {/* Category Sections */}
        {Object.entries(categories).map(([category, categoryItems], index) => {
          const filteredItems = getFilteredItems(categoryItems);
          if (searchQuery && filteredItems.length === 0) return null;

          const isCollapsed = collapsedCategories[category];
          const config = CATEGORY_CONFIG[category] || { emoji: "📦", bg: "#f7fafc" };
          const catChecked = categoryItems.filter((i) => i.checked).length;

          return (
            <CategorySection key={category} index={index}>
              <CategoryHeader onClick={() => toggleCategory(category)}>
                <CategoryEmoji bg={config.bg}>{config.emoji}</CategoryEmoji>
                <CategoryName>{category}</CategoryName>
                <CategoryCount>
                  {catChecked}/{categoryItems.length}
                </CategoryCount>
                <CategoryChevron open={!isCollapsed}>
                  {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
                </CategoryChevron>
              </CategoryHeader>

              {!isCollapsed && (
                <CategoryItems>
                  {filteredItems.map((item, itemIdx) => (
                    <ItemRow
                      key={`${item.name}-${itemIdx}`}
                      checked={item.checked}
                      onClick={() => toggleItem(item.name)}
                    >
                      <Checkbox checked={item.checked}>
                        {item.checked && <FaCheck />}
                      </Checkbox>
                      <ItemEmoji>{item.emoji}</ItemEmoji>
                      <ItemName checked={item.checked}>{item.name}</ItemName>
                      {item.is_weather_based && <WeatherTag>🌤️ Weather</WeatherTag>}
                      <ItemReason>{item.reason}</ItemReason>
                      {item.reason === "Custom item" && (
                        <DeleteItemBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item.name);
                          }}
                        >
                          <FaTrashAlt />
                        </DeleteItemBtn>
                      )}
                    </ItemRow>
                  ))}

                  {/* Add Custom Item */}
                  <AddItemRow onClick={(e) => e.stopPropagation()}>
                    <AddItemInput
                      placeholder={`Add item to ${category}...`}
                      value={newItemTexts[category] || ""}
                      onChange={(e) =>
                        setNewItemTexts((prev) => ({
                          ...prev,
                          [category]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomItem(category);
                        }
                      }}
                    />
                    <AddItemBtn
                      onClick={() => addCustomItem(category)}
                      disabled={!(newItemTexts[category] || "").trim()}
                    >
                      <FaPlus />
                    </AddItemBtn>
                  </AddItemRow>
                </CategoryItems>
              )}
            </CategorySection>
          );
        })}
      </PageContainer>
    </MainContainer>
  );
}

export default PackingChecklist;
