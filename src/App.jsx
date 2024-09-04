import React from 'react'
import Home from './component/Home.jsx'
import Start from './component/start.jsx'
import { BrowserRouter as Router,  Routes, Route} from "react-router-dom";
import History from './component/History.jsx'


const App = () => {
  return (
    <div>
      <Router>
        <div className="App">
            <Start />
            <Routes>
       
            <Route path="/weather/:cityName" element={<Home />} />
             <Route path="/history" element={<History />} />
             </Routes>
        </div>
    </Router>
    </div>
  )
}

export default App
