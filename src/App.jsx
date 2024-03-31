import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';

import Landing from './pages/Landing'
import Authentication from './pages/Authentication';
import Dashboard from './pages/Dashboard';
import Guard from './utils/Guard';

export default function App() {
  return (
    <>
      <Guard />
      <Router>
        <Routes>
          <Route path="/" Component={Landing} />
          <Route path="/authentication" Component={Authentication} />
            <Route path="/dashboard" Component={Dashboard} />
        </Routes>
      </Router>
    </>
  )
}
