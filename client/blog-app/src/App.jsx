import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { IndexPage } from "./pages/IndexPage";
import { LoginPage } from "./pages/loginPage";
import { SignupPage } from "./pages/signupPage";
import { CreatePost } from "./pages/CreatePost";
import { PostPage } from "./pages/PostPage";
import { Post } from "./components/Post";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContextProvider } from "./UserContext";
import { EditPost } from "./pages/EditPost";

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

            <Route path="post/:id" element={<PostPage/>}/>
            <Route path="/edit/:id" element={<EditPost/>}/>
          </Route>
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
