import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/core/styles.layer.css'
import './layout.css'
import { ConnectPage } from './pages/ConnectPage'
import { MainPage } from './pages/MainPage'
import { BotEditPage } from './pages/BotEditPage'
import { MonitPage } from './pages/MonitPage'
import { ContentPage } from './pages/ContentPage'
import { EventPage } from './pages/EventPage'

function App() {

  return (
    <MantineProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ConnectPage/>} />
            <Route path="/main" element={<MainPage/>} />
            <Route path="/botedit/:botId" element={<BotEditPage/>} />
            <Route path="/monit/:botId/:botName" element={<MonitPage/>} />
            <Route path="/content/:botId/:botName" element={<ContentPage/>} />
            <Route path="/event/:botId/:botName" element={<EventPage/>} />
          </Routes>
        </BrowserRouter>
    </MantineProvider>
  )
  
}

export default App
