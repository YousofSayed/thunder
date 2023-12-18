import Header from "../Components/App/Header";
import { $a, parse } from "../js/cocktail";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "../Components/App/Footer";

function App() {
    const user = parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        !user ? navigate('/auth') : null;
    }, [])

 

    return (
        <section className="flex flex-col justify-between h-full">
            <Header />
            <main className="w-full h-[calc(100%-100px)] flex justify-center p-2  relative">
                <Outlet />
            </main>
            <Footer/>
        </section>
    );
}

export default App;