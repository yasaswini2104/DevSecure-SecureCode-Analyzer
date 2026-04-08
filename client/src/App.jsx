import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScannerPage from './pages/ScannerPage';

const App = () => (
  <div className="app">
    <Header />
    <ScannerPage />
    <Footer />
  </div>
);

export default App;
