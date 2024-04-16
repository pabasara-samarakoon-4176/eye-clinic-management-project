
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
// App.js
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/SignUp/SignUp";
import LensDB from "./Pages/LensDB/LensDB";
import AnalyticsDB from "./Pages/AnalyticsDB/Analytics";
import PatientDB from "./Pages/PatientDB/PatientDB";
import SurgeryDB from "./Pages/SurgeryDB/SurgeryDB";

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route index element={<Login/>}/>
        <Route path="/:doctorId/home" element={<Home/>}/>
        <Route path="/signUp" element={<SignUp/>}/>
        <Route path="/analyticsDB" element={<AnalyticsDB/>}/>
        <Route path="/:doctorId/patientDB" element={<PatientDB/>}/>
        <Route path="/:doctorId/surgeryDB" element={<SurgeryDB/>}/>
        <Route path="/:doctorId/lensDB" element={<LensDB/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

