import Header from "../Components/Shared/Header";
import { parse } from "../js/cocktail";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function App() {
    const user = parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(()=>{
        !user? navigate('/auth') : null;
    },[])
    
    
    return (
        <>
            <Header />
            <main className="w-full h-[calc(100%-74px)] p-2 flex justify-center relative">
                <Outlet/>
            </main>
        </>
    );
}

export default App;