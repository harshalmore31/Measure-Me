import { useState, useEffect } from "react"
import NavigationHeader from "../components/NavigationHeader"
import BMIDisplay from "../components/BMIDisplay"
import StudentProfile from "../components/StudentProfile"
import PageFooter from "../components/PageFooter"
import HeightChart from "./heightchart"
import WeightChart from "./weightchart"

export default function SchoolMeasurementApp() {
  const [bmi, setBMI] = useState(0)
  const [height, setHeight] = useState(0)
  const [weight, setWeight] = useState(0)
  const [view, setView] = useState('main') // 'main', 'height', or 'weight'

  useEffect(() => {
    // Simulating random data
    const randomHeight = Math.floor(Math.random() * (200 - 150 + 1)) + 150 // 150-200 cm
    const randomWeight = Math.floor(Math.random() * (100 - 40 + 1)) + 40 // 40-100 kg
    setHeight(randomHeight)
    setWeight(randomWeight)
    
    // Calculate BMI directly here
    const calculatedBMI = (randomWeight / Math.pow(randomHeight / 100, 2)).toFixed(1)
    setBMI(parseFloat(calculatedBMI))
  }, [])

  const renderContent = () => {
    switch(view) {
      case 'height':
        return <HeightChart onBack={() => setView('main')} />
      case 'weight':
        return <WeightChart onBack={() => setView('main')} />
      default:
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <StudentProfile />
            <BMIDisplay 
              bmi={bmi} 
              height={height} 
              weight={weight} 
              onHeightClick={() => setView('height')}
              onWeightClick={() => setView('weight')}
            />
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="w-full">
        <NavigationHeader />
      </header>
      
      <main className="flex-grow w-full bg-white">
        <div className="px-[190px] py-6 min-h-[calc(100vh-64px-56px)]"> {/* Adjust these values based on your header and footer heights */}
          {view === 'main' && (
            <>
              <h2 className="text-2xl font-bold mb-2">School HW Measurement Tracking System</h2>
              <p className="text-gray-600 mb-6">
                Simplified measuring and tracking height and weight for all students across various branches, in <span className="font-bold">one Click</span>
              </p>
            </>
          )}
          {renderContent()}
        </div>
      </main>
      
      <footer className="w-full">
        <PageFooter />
      </footer>
    </div>
  )
}