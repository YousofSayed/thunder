import { useContext, useEffect } from "react";
import { storeCtx } from "../../js/store";

const Container = ({ innerRef, className, children }) => {
    const {dispatch} = useContext(storeCtx);
    useEffect(()=>{
        if(innerRef.current){
            console.log(innerRef);
            dispatch({type:'put',key:'postSectionRef',value:innerRef.current})
        }
    },[])
    return (
        <section ref={innerRef}  className={`container h-[calc(100%-120px)] flex flex-col items-center gap-3 bg-[#eee] dark:bg-[#171717]  p-2 overflow-y-scroll hide-scrollbar ${className}`}>
            {children}
        </section>
    );
}

export { Container };