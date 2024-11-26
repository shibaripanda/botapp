// import 'dotenv/config'
import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/core/styles.layer.css'
import '@mantine/dates/styles.css'; 
import './layout.css'
// import 'dayjs/locale/ru'
// import dayjs from 'dayjs'
// import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ConnectPage } from './pages/ConnectPage.js'
import { MainPage } from './pages/MainPage.js'
import { BotEditPage } from './pages/BotEditPage.js'
import { MonitPage } from './pages/MonitPage.js'
import { ContentPage } from './pages/ContentPage.js'
import { EventPage } from './pages/EventPage.tsx'

import 'dayjs/locale/ru'
import 'dayjs/locale/en'
import 'dayjs/locale/es'
import 'dayjs/locale/fr'
import 'dayjs/locale/pt'
import 'dayjs/locale/de'
import 'dayjs/locale/zh'
import 'dayjs/locale/it'
import 'dayjs/locale/ja'
import 'dayjs/locale/ko'
import 'dayjs/locale/ar'
import 'dayjs/locale/hi'
import 'dayjs/locale/he'
import 'dayjs/locale/tr'
import 'dayjs/locale/vi'
import 'dayjs/locale/nl'
import 'dayjs/locale/pl'
import 'dayjs/locale/id'
import 'dayjs/locale/sv'
import 'dayjs/locale/cs'
import 'dayjs/locale/uk'
import 'dayjs/locale/hu'
import 'dayjs/locale/th'
import 'dayjs/locale/el'
import 'dayjs/locale/da'
import 'dayjs/locale/fi'
import 'dayjs/locale/ro'
import 'dayjs/locale/sk'
import 'dayjs/locale/be'

declare global {
  interface Window {
    textBotApp:any;
    lengBotApp:any;
    avlengBotApp:any;
  }
}

// dayjs.extend(customParseFormat)

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
