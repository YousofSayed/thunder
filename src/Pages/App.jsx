import Header from "../Components/Header";
import LogOrSign from "../Components/LogOrSign";
import SearchlistComp from "../Components/SearchlistComp";
import { $, getCookies, navigate, render, stringify, wssEmit } from "../js/cocktail";
/**
 * 
 * @param {WebSocket} wss
 * @returns 
 */

function App({wss}) {
    return (
        <>
            <Header wss={wss} SearchlistComp={<SearchlistComp/>}/>
            <LogOrSign/>
        </>
    );
}

export default App;