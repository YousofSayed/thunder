import { createRoot } from 'react-dom/client';
import App from './Pages/App';
import { getLocalDate, makeAppResponsive} from './js/cocktail';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import './js/initSockets';
import './main.css';
import PostsView from './Pages/PostsView';
import LogOrSign from './Pages/LogOrSign';
import MakeRetweet from './Pages/MakeRetweet';

const root = createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />} >
                <Route path='/' element={<PostsView/>}/>
                <Route path='/auth' element={<LogOrSign/>}/>
                <Route path='/repost/:postIndex' element={<MakeRetweet/>}/>
            </Route>
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
        </Routes>
    </BrowserRouter>
)

makeAppResponsive('#root')