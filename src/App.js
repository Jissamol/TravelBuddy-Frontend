import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PersonalizePlan from './components/PersonalizePlan';
import ItineraryPage from './components/ItineraryPage';
import TopItineraries from './components/TopItineraries';
import AllItinerariesPage from './components/AllItinerariesPage';
import TripJoinPage from './components/TripJoinPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/personalize-plan" element={<PersonalizePlan />} />
            <Route path="/plans/:planId/itineraries" element={<ItineraryPage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/top-itineraries" element={<TopItineraries />} />
            <Route path="/all-itineraries" element={<AllItinerariesPage />} />
            <Route path="/join/:token" element={<TripJoinPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
