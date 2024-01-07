import { Link, useNavigate } from "react-router-dom";
import styles from "../js/styles";
import {  parse } from "../js/cocktail";
import { useEffect } from "react";

function Auth() {
    const user = parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(()=>{
        user ? navigate('/') : console.log(false);
    },[]);

    return (
        <section className="h-full container flex justify-center items-center ">
            {/* <button className="fixed right-9 top-7 w-8 h-8 rounded-full bg-gray-950 hover:text-cyan-400 transition" onClick={hide}><i className="fa-solid fa-x"></i></button> */}
            <article className="p-4 bg-[#eee] dark:bg-[#111] text-black dark:text-white rounded-lg">
                <p className="p-4 font-bold">You Should Login Or Signup</p>
                <div className="flex justify-evenly items-center"><Link className={styles.btn} to={`/login`}>Login</Link> | <Link className={styles.btn} to={`/signup`}>Signup</Link></div>
            </article>
        </section>
    );
}

export default Auth;