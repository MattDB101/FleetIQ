import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
// pages & components
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/drivers/Drivers';
import Diary from './pages/diary/Diary';
import Settings from './pages/settings/Settings';
import ClippedDrawer from './app_bar';
import Drivers from './pages/drivers/Drivers';
import Vehicles from './pages/vehicles/Vehicles';
import FireExtinguishers from './pages/fireextinguishers/FireExtinguishers';
import Tax from './pages/tax/Tax';
import FirstAid from './pages/firstaid/FirstAid';
import TachoCalibration from './pages/tachocalibration/TachoCalibration';
import CVRT from './pages/cvrt/CVRT';
import PSV from './pages/psv/PSV';
import RTOL from './pages/rtol/RTOL';

function App() {
  const { authIsReady, user } = useAuthContext();

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <ClippedDrawer>
            <Routes>
              <Route path="/" element={user ? <Navigate to="/diary" /> : <Navigate to="/login" />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/drivers" element={user ? <Drivers /> : <Navigate to="/" />} />
              <Route path="/vehicles" element={user ? <Vehicles /> : <Navigate to="/" />} />
              <Route path="/diary" element={user ? <Diary /> : <Navigate to="/" />} />
              <Route path="/tax" element={user ? <Tax /> : <Navigate to="/" />} />
              <Route path="/cvrt" element={user ? <CVRT /> : <Navigate to="/" />} />
              <Route path="/psv" element={user ? <PSV /> : <Navigate to="/" />} />
              <Route path="/rtol" element={user ? <RTOL /> : <Navigate to="/" />} />
              <Route path="/fireextinguishers" element={user ? <FireExtinguishers /> : <Navigate to="/" />} />
              <Route path="/firstaid" element={user ? <FirstAid /> : <Navigate to="/" />} />
              <Route path="/tachocalibration" element={user ? <TachoCalibration /> : <Navigate to="/" />} />
              <Route path="/settings" element={user ? <Settings /> : <Navigate to="/" />} />
            </Routes>
          </ClippedDrawer>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
