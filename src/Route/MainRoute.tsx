import { Route, Routes } from "react-router-dom"
import { GlobalLayout } from "../_components"
import { Lobby, MeetRoom } from "../pages"

export const MainRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<GlobalLayout/>}>
                <Route path="/" element={<Lobby/>} />
            </Route>
            <Route path="/" element={<GlobalLayout/>}>
                <Route path="/meet-room/:roomID" element={<MeetRoom/>} />
            </Route>
        </Routes>
    );
};