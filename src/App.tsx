import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css'
import Login from "./screens/Login/Login";
import Home from "./screens/Home/Home";
import Dashboard from "./screens/Dashboard/Dashboards";
import TestDashboard from './screens/TestDashboard/TestDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test" element={<TestDashboard />} />
      </Routes>
    </Router>
  );
}
export default App;