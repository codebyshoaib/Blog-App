import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { IndexPage } from "./pages/IndexPage";
import { LoginPage } from "./pages/loginPage";
import { SignupPage } from "./pages/signupPage";
import { CreatePost } from "./pages/CreatePost";
import { Post } from "./components/Post";
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
            <Route path="create" element={<CreatePost/>}/>
            <Route path="post" element={<Post/>}/>
          </Route>
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
