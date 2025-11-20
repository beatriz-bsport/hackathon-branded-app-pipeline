import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import MemberAreaPage from "./pages/MemberAreaPage";
import PassesPage from "./pages/PassesPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/passes" element={<PassesPage />} />
          <Route path="/member-area" element={<MemberAreaPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
