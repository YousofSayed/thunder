import { useEffect, useRef, useState } from "react";
import { CocktailDB, nFormatter, parse } from "../../js/cocktail";

function Reacts(props) {
    const [isReacted, setIsReacted] = useState(false);
    const reactIconRef = useRef();
    const reacCounterRef = useRef();
    const editeIconRef = useRef();
    const user = parse(localStorage.getItem('user'));
    const db = new CocktailDB(user.email);
    useEffect(() => {
        checkReact();
    }, []);


    //Methods
    const checkReact = async () => {
        const reactFromIDB = await (await db.openCollection('Reacts')).findOne({ _id: props._id });
        if (reactFromIDB) {
            // reactIconRef.current.classList.add('text-red-700', 'fa-solid', 'text-2xl');
            setIsReacted(reactFromIDB.type);
        }
    };

    return (
       
    );
}

export default Reacts;