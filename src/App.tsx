import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ServicesPage from "./pages/ServicesPage";
import DetailPage from "./pages/DetailPage";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ServicesPage />} />
                <Route path="/detail/:id" element={<DetailPage />} />
            </Routes>
        </Router>
    );
};

export default App;
