import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/Home';
import FriendsPage from '@/pages/Friends';
import MissionsPage from '@/pages/Missions';
import RewardsPage from '@/pages/Rewards';
import RankingPage from '@/pages/Ranking';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
