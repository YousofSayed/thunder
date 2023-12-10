import { useEffect, useRef } from "react";

function Textarea({ value, focus, lengthLimit, setContext, context , overwriteValue }) {
    const { postContent } = context;
    const textAreaRef = useRef();
    useEffect(() => {
        if (focus) {
            textAreaRef.current.focus();
            textAreaRef.current.classList.add('min-h-[300px]')
        }
    })

    if (setContext && context) {
        context.textAreaRef = textAreaRef.current
    }


    const limitChars = (ev) => {
        if (+ev.target.value.length > lengthLimit) { ev.target.value = postContent; return }
        setContext({
            ...context,
            charLength: ev.target.value.length,
            // postContent: ev.target.value, //For changging of content of create post
            // editeValue: ev.target.value,
            [overwriteValue]:ev.target.value
        })
    };

    const fitAndShrinkContetntArea = (ev) => {
        const { classList } = ev.target
        classList.contains('fa-expand') ? ev.target.classList.replace('fa-expand', 'fa-compress') : ev.target.classList.replace('fa-compress', 'fa-expand');
        textAreaRef.current.classList.toggle('min-h-[300px]')
    };

    return (
        <section className='relative overflow-y-auto  max-h-[400px] h-fit mt-3'>
            <i onClick={fitAndShrinkContetntArea} className="fa-solid fa-expand  absolute ltr:right-[5px] rtl:left-[5px] top-[5px] cursor-pointer p-2 flex items-center justify-center rounded-full bg-gray-950 "></i>
            <textarea
                ref={textAreaRef}
                onInput={limitChars}
                className=' w-full font-medium  outline-none bg-gray-900 p-2 ltr:pr-[30px] rtl:pl-[30px] rounded-lg resize-none transition-all'
                placeholder='What is in your mind ?'
                defaultValue={value}
            ></textarea>
        </section>
    );
}

export default Textarea;