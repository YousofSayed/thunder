import Header from "../Components/App/Header";
import { $a, parse } from "../js/cocktail";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "../Components/App/Footer";
import { StoreProvider } from "../js/store";

function App() {
    const user = parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        !user ? navigate('/auth') : null;
    }, [])


    return (
        <StoreProvider>
            {/* <section className="flex flex-col justify-between h-full">
            </section> */}
                <main className="w-full h-full flex items-center flex-col justify-between">
                    <Header />
                    <Outlet />
                    {user && <Footer />}
                </main>
        </StoreProvider>
    );
}

export default App;