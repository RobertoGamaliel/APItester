import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/animations.css';
import './Styles/backgroundColors.css';
import './Styles/componentsStyles.css';
import './Styles/efects.css';
import './Styles/loaders.css';
import './Styles/positions.css';
import './Styles/scaleEffects.css';
import './Styles/sizes.css';
import './Styles/textColors.css';
import './Styles/backgroundGradients.css';
import './Styles/images.css';
import './Styles/fonts.css';
import './Styles/breacksPoints.css';
import './Styles/dinamicWidth.css';

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
