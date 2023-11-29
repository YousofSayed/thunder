import { Link } from "react-router-dom";
import styles from "../js/styles";
import { $ } from "../js/cocktail";

function LogOrSign() {

    //Methods
    const hide = ()=>{
        $('#logOrSign').classList.add('hidden');
    }

    return ( 
        <section id="logOrSign" className="w-full h-full absolute flex justify-center items-center rounded-lg">
            {/* <button className="fixed right-9 top-7 w-8 h-8 rounded-full bg-gray-950 hover:text-cyan-400 transition" onClick={hide}><i className="fa-solid fa-x"></i></button> */}
            <article className="p-4 bg-gray-900">
                <p className="p-4 font-bold">You Should Login Or Signup</p>
                <div className="flex justify-evenly items-center"><Link className={styles.btn} to={`login`}>Login</Link> | <Link className={styles.btn} to={`signup`}>Signup</Link></div>
            </article>
        </section>
     );
}

export default LogOrSign;