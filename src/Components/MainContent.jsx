import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Posts from "./Posts";
import Stories from "./Stories";

function MainContent() {
    return (
        <main className="w-full h-[calc(100%-64px)] p-2 flex justify-between">
            <Nav />
            <Posts />
            <Stories/>
            <Outlet />
        </main>
    );
}

export default MainContent;