import { createRoot } from 'react-dom/client';
import App from './Pages/App';
import { getLocalDate, makeAppResponsive } from './js/cocktail';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import './js/initSockets';
import './main.css';
import PostsView from './Pages/PostsView';
import Auth from './Pages/Auth';
import MakeRetweet from './Pages/MakeRepost';

const handleDarkMode = ()=>{
    if (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'dark')
        document.documentElement.classList.add('dark');
    }
    else {
        document.documentElement.classList.add(localStorage.getItem('theme'));
    }
};

handleDarkMode();

const root = createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />} >
                <Route path='/' element={<PostsView />} />
                <Route path='/auth' element={<Auth />} />
                <Route path='/repost/:postIndex' element={<MakeRetweet />} />
            </Route>
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
        </Routes>
    </BrowserRouter>
)

makeAppResponsive('#root')