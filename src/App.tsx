import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css'
import Login from "./screens/Login/Login";
import Home from "./screens/Home/Home";
import Dashboard from "./screens/Dashboard/Dashboards";
import DashboardDetail from './screens/Dashboard/DashboardDetail';
import Explore from './screens/Explore/Explore';
import TestDashboard from './screens/TestDashboard/TestDashboard';
import Showcase from './screens/Showcase/Showcase';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:dashboardId" element={<DashboardDetail />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/test" element={<TestDashboard />} />
        <Route path="/showcase" element={<Showcase />} />
      </Routes>
    </Router>
  );
}
export default App;