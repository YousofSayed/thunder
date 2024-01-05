import { forwardRef } from "react";

const Container = ({ innerRef, children }) => {
    // forwardRef
    return (
        <section ref={innerRef}  className="container h-[calc(100%-120px)] flex flex-col items-center gap-3 bg-[#eee] dark:bg-transparent  p-2 overflow-y-scroll hide-scrollbar">
            {children}
        </section>
    );
}

export { Container };