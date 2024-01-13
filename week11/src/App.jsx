import { BrowserRouter, Route, Routes } from "react-router-dom"
import MyContainer from "./components/MyContainer"
import Header from "./components/Header"
import About from "./components/About"
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element = {<> <Header /> <MyContainer /> </>} />
          <Route path="/about" element = {<> <Header /> <About /> </>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
