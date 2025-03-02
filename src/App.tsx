import React, {useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import MainPage from "./pages/MainPage";
import DetailPage from "./pages/DetailPage";
import {Service, Tag} from "./types";


export     const BASE_URL = (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : 'http://localhost:1337';


const App: React.FC = () => {

    const [services, setServices] = useState<Service[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage services={services}
                                                   setServices={setServices}
                                                   tags={tags}
                                                   setTags={setTags}
                                                   selectedTags={selectedTags}
                                                   setSelectedTags={setSelectedTags}/>}/>
                <Route path="/detail/:id" element={<DetailPage/>}/>
            </Routes>
        </Router>
    );
};

export default App;
