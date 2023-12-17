import { getLocalDate } from "../../js/cocktail";

function PostDate({date}) {
    
    return (
        <section id="date" className="text-gray-500 dark:text-gray-400 text-sm font-bold py-2">
            {date.split(',')[0] == getLocalDate() ? `Today , ${date.split(',')[1]}` : date}
        </section>
    );
}
export default PostDate;