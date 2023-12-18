import Header from "../Components/Shared/Header";
import { parse } from "../js/cocktail";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function App() {
    const user = parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        !user ? navigate('/auth') : null;
    }, [])


    return (
        <section className="flex flex-col justify-between h-full">
            <Header />
            <main className="w-full h-[calc(100%-110px)] flex justify-center p-2  relative">
                <Outlet />
            </main>
            <footer className="w-full h-[45px] flex justify-center">
                <ul className="container bg-gray-900 rounded-lg p-2 flex items-center justify-between">
                    <Link to={'/'}><i className="fa-solid fa-home cursor-pointer"></i></Link>
                    <i className="fa-solid fa-bookmark cursor-pointer"></i>
                    <i className="fa-solid fa-user cursor-pointer"></i>
                    <Link to={'/search'} ><i className="fa-solid fa-search cursor-pointer"></i></Link>
                </ul>
            </footer>
        </section>
    );
}

export default App;