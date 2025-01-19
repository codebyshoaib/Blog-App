import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { IndexPage } from "./pages/indexPage";
import { LoginPage } from "./pages/loginPage";
import { SignupPage } from "./pages/signupPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContextProvider } from "./UserContext";

function App() {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<SignupPage />} />
          </Route>
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
