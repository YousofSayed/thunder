import { Link } from "react-router-dom";
import style from '../js/styles'

function Anonymous() {
    return ( 
        <section className="w-[75%] h-full bg-gray-900 flex justify-center items-center rounded-lg shadow-md">
            <main className="w-[60%] p-2 bg-gray-950 ring-2 shadow-md rounded-lg">
                <p className="p-3 bg-gray-900 font-medium text-center rounded-lg">You are an Anonymous</p>
                <section className="flex justify-evenly items-center p-3">
                    <Link to={'/login'} className={style.btn}>Login</Link>
                    |
                    <Link to={'/signup'} className={style.btn}>Signup</Link>
                </section>
            </main>
        </section>
     );
}

export default Anonymous;