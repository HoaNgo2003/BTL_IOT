import "./App.css";

import { Route, Routes } from "react-router-dom";

import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Admin from "./components/Admin";

function App() {
  return (
    //   <Route path="/admin" element={<Admin />}>
    //   {/* Use relative paths for nested routes */}
    //   <Route path="dashboard" element={<Controller />} />
    //   <Route path="history" element={<History />} />
    //   <Route path="data" element={<DataSensor />} />
    // </Route>

    <Routes>
      <Route path="/" element={<Admin />} />
      <Route path="/sign-up" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
}

export default App;
