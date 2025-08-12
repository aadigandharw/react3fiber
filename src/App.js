import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Day1 from './Component/Day 1/Day1'
import Day1task from './Component/Day 1/Day1task'
import Day2 from './Component/Day 2/Day2'
import Day3 from './Component/Day 3/Day3'
import Day4 from './Component/Day 4/Day4'
import Day5 from './Component/Day 5/Day5'
import Day6 from './Component/Day 6/Day6'





function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>

        {/* <Route path='/' element = {<Day1/>} /> */}
        {/* <Route path='/' element = {<Day2/>} /> */}
        {/* <Route path='/' element = {<Day3/>} /> */}
        {/* <Route path='/' element = {<Day4/>} /> */}
        {/* <Route path='/' element = {<Day5/>} /> */}
        <Route path='/' element = {<Day6/>} />
        {/* <Route path='/' element = {<Day1task/>} /> */}

      </Routes>

      </BrowserRouter>
    </div>
  )
}

export default App