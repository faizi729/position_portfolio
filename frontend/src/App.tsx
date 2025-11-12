 
 
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TradeForm from './pages/trade'
import Positions from './pages/position'
import PnLPage from './pages/pnl'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>

      <Route path="/" element ={<LoginPage />}/>
      <Route path="/position" element ={<Positions />}/>
      <Route path="/pnl" element ={<PnLPage />}/>
      <Route path="/register" element ={<RegisterPage />} />
      <Route path="/trade" element ={<TradeForm />} />
      </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
