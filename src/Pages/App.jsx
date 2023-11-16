import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import LogOrSign from "../Components/LogOrSign";
import Nav from "../Components/Nav";
import SearchlistComp from "../Components/SearchlistComp";
import { $, getCookies, navigate, render, stringify, wssEmit } from "../js/cocktail";
import MainContent from "../Components/MainContent";
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
            <MainContent/>
            
        </>
    );
}

export default App;