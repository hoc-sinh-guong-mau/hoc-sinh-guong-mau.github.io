import { GettingStarted } from './sections/GettingStarted'
import { NextSteps } from './sections/NextSteps'
import './styles/App.css'

function App() {
  return (
    <>
      <GettingStarted />
      <div className="ticks"></div>
      <NextSteps />
      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
