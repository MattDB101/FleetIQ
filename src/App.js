import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';
// pages & components
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Register from './pages/drivers/Drivers'
import Diary from './pages/diary/Diary'
import Settings from './pages/settings/Settings'
import ClippedDrawer from './app_bar';
import Drivers from './pages/drivers/Drivers';
import Vehicles from './pages/vehicles/Vehicles';
import FireExtinguishers from './pages/fireextinguishers/FireExtinguishers';
import FirstAid from './pages/firstaid/FirstAid';
import TachoCalibration from './pages/tachocalibration/TachoCalibration';

function App() {
  const { authIsReady, user } = useAuthContext()

  return (

    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <ClippedDrawer>
            <Switch>
              
              <Route exact path="/">
                {user && <Redirect to="/diary" />}
                {!user && <Redirect to="/login" />}
              </Route>

              
              <Route path="/login">
                {!user && <Login />}
                {user && <Redirect to="/" />}
              </Route>

              <Route path="/Drivers">
                {user && <Drivers />}
                {!user && <Redirect to="/" />}
              </Route>

              <Route path="/vehicles">
                {user && <Vehicles />}
                {!user && <Redirect to="/" />}
              </Route>
              
              <Route path="/diary">
                {user && <Diary />}
                {!user && <Redirect to="/" />}
              </Route>

              <Route path="/fireextinguishers">
                {user && <FireExtinguishers />}
                {!user && <Redirect to="/" />}
              </Route>

              <Route path="/firstaid">
                {user && <FirstAid />}
                {!user && <Redirect to="/" />}
              </Route>

              <Route path="/tachocalibration">
                {user && <TachoCalibration />}
                {!user && <Redirect to="/" />}
              </Route>

              <Route path="/settings">
                {user && <Settings />}
                {!user && <Redirect to="/" />}
              </Route>


            </Switch>
          </ClippedDrawer>
          
        </BrowserRouter>
      )}
    </div>
  );
}

export default App
