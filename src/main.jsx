import { createRoot } from 'react-dom/client';
import App from './Pages/App';
import { makeAppResponsive , get, post} from './js/cocktail';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import './main.css';
// import gapi from './js/gapi';
import Posts from './Components/Posts';
// import gapi from 'gapi-client';

const root = createRoot(document.getElementById('root'));
const wss = new WebSocket(`ws://localhost:9090 `);
const apiKey = `AIzaSyCu8n2z2Pt0NNuLYMwlV6FPJSh78MCNrTw`;
const client_id = `259661810175-07tpg69h1rsuljuld4jpucfuj5m2f285.apps.googleusercontent.com`
//https://developers.google.com/oauthplayground/
// https://ei.docs.wso2.com/en/latest/micro-integrator/references/connectors/google-spreadsheet-connector/get-credentials-for-google-spreadsheet/
// const access_token = `ya29.a0AfB_byBhhbmOsqtDbxJqFR3aSVL0OLbqzX879DcHoL9BzR9taTXTnlL2hA9_RaGwbRXY8A6qSF2c5LjeY-t02DtDyGC0DYmqaM74vYN2b833pPYrhNfeul5t2ijrYImV1fdKq8Dl5JtuR4i5VxA6LEVWPDCb5Rl73XrqaCgYKAfYSARISFQHGX2MiekdmD8T0wAR3cPca9S-bCg0171`;

// const urlApp =  `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_DB_ID }/values:batchClearByDataFilter?key=${apiKey}`

// Authorization: Bearer [YOUR_ACCESS_TOKEN]
// Accept: application/json
// Content-Type: application/json

// {}


// console.log(
// //     await(await post({
// //         url:urlApp,
// //         headers:{
// //             Authorization : `Bearer ${access_token}`,
// //             Accept : `application/json`,
// //             'Content-Type':`application/json`
// //         },
// //         data:{
// //             "dataFilters": [
// //               {
// //                 "a1Range": "Users"
// //               }
// //             ]
// //           }
          
// //     }))
// // );

root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App wss={wss} />} >
                {/* <Route path='/posts' element={<Posts/>}/> */}
            </Route>
            <Route path='/signup' element={<Signup wss={wss} />} />
            <Route path='/login' element={<Login wss={wss} />} />
        </Routes>
    </BrowserRouter>
)

makeAppResponsive('#root')