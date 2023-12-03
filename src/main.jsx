import { createRoot } from 'react-dom/client';
import App from './Pages/App';
import { makeAppResponsive } from './js/cocktail';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import './main.css';

const root = createRoot(document.getElementById('root'));


root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />} >
                {/* <Route path='/posts' element={<Posts/>}/> */}
            </Route>
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
        </Routes>
    </BrowserRouter>
)

makeAppResponsive('#root')