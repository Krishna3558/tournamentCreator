import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from 'react-hot-toast'
import PublicRoutes from './routes/PublicRoutes'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoutes from './routes/ProtectedRoutes'
import Home from './pages/Home'
import Matches from './pages/Matches'
import PointsTable from './pages/PointsTable'
import LeagueHeader from './components/LeagueHeader'

function App() {

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <LeagueHeader/>
      
      <Routes>
        <Route path='/login' element={
          <PublicRoutes>
            <Login/>
          </PublicRoutes>
        } />

        <Route path='/register' element={
          <PublicRoutes>
            <Signup/>
          </PublicRoutes>
        } />

        <Route path='/' element={
          <ProtectedRoutes>
            <Home/>
          </ProtectedRoutes>
        } />

        <Route path='/season/schedule/:id' element={
          <ProtectedRoutes>
            <Matches/>
          </ProtectedRoutes>
        } />

        <Route path='/season/points-table/:id' element={
          <ProtectedRoutes>
            <PointsTable/>
          </ProtectedRoutes>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
