import { MainRoute } from "./Route/MainRoute"
import { MeetRoomContextProvider } from "./context/MeetRoomContextProvider"

function App() {  

  return (
    <MeetRoomContextProvider>
     <MainRoute />
    </MeetRoomContextProvider>
  )
}

export default App
