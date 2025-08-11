import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Day1 from './Component/Day 1/Day1'
import Day1task from './Component/Day 1/Day1task'
import Day2 from './Component/Day 2/Day2'
import Day3 from './Component/Day 3/Day3'





function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>

        {/* <Route path='/' element = {<Day1/>} /> */}
        {/* <Route path='/' element = {<Day2/>} /> */}
        <Route path='/' element = {<Day3/>} />
        {/* <Route path='/' element = {<Day1task/>} /> */}

      </Routes>

      </BrowserRouter>
    </div>
  )
}

export default App