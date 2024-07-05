import ReactDOM from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import "antd/dist/reset.css"

import { GlobalContextProvider } from './context/GlobalContextProvider.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <GlobalContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<App />} />
      </Routes>
    </BrowserRouter>
  </GlobalContextProvider>,
);
