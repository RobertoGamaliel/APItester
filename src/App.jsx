import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/animations.css';
import './styles/backgroundColors.css';
import './styles/componentsStyles.css';
import './styles/efects.css';
import './styles/loaders.css';
import './styles/positions.css';
import './styles/scaleEffects.css';
import './styles/sizes.css';
import './styles/textColors.css';
import './styles/backgroundGradients.css';
import './styles/images.css';
import './styles/fonts.css';
import './styles/breacksPoints.css';
import './styles/dinamicWidth.css';

import Tester from "./Pages/Tester";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Tester} />

      </Routes>
    </Router>
  );
}

export default App
