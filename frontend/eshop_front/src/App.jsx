import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerPanel from './pages/SellerPanel';
import Products from './pages/Products';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/sellerpanel' element={<SellerPanel/>}/>
            <Route path='/products' element={<Products/>}/>

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
