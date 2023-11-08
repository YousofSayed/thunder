import { createRoot } from 'react-dom/client';
import App from './Pages/App';
import { makeAppResponsive } from './js/cocktail';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login'
import './main.css'

const root = createRoot(document.getElementById('root'));
const wss = new WebSocket(`ws://localhost:9090 `);


root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App wss={wss} />} />
            <Route path='/signup' element={<Signup wss={wss} />} />
            <Route path='/login' element={<Login wss={wss} />} />
        </Routes>
    </BrowserRouter>
)

makeAppResponsive('#root')