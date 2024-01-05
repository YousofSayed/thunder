import { forwardRef } from "react";

const Container = ({ innerRef, children }) => {
    // forwardRef
    return (
        <section ref={innerRef}  className="container mt-[45px] mb-[40px]  h-full relative flex flex-col items-center gap-3 bg-[#eee] dark:bg-transparent  p-2 ">
            {children}
        </section>
    );
}

export { Container };