import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BMICalculatorProps {
  bmi: number
  height: number
  weight: number
  onHeightClick: () => void
  onWeightClick: () => void
}

const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return { category: "Underweight", color: "#3b82f6" };
  if (bmi < 25) return { category: "Normal", color: "#22c55e" };
  if (bmi < 30) return { category: "Overweight", color: "#f97316" };
  return { category: "Obese", color: "#ef4444" };
};

export default function BMICalculator({ bmi, height, weight, onHeightClick, onWeightClick }: BMICalculatorProps) {
  const bmiCategory = getBMICategory(bmi)

  return (
    <div className="grid gap-4 md:gap-6">
      <Card className="bg-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg md:text-xl font-bold">BMI</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative w-full h-16 md:h-24 bg-gradient-to-r from-blue-500 via-green-500 to-orange-500 to-red-500 rounded-full overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-between px-2 md:px-4 text-[10px] md:text-xs text-white font-semibold">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
            <div 
              className="absolute bottom-0 w-1 h-full bg-black transform -translate-x-1/2 origin-bottom"
              style={{ left: `${(bmi / 40) * 100}%` }}
            ></div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-base md:text-lg font-semibold">BMI: {bmi.toFixed(1)}</p>
            <p className="text-sm md:text-md" style={{ color: bmiCategory.color }}>{bmiCategory.category}</p>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <Card 
          className="bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={onHeightClick}
        >
          <CardHeader className="p-2 md:p-4">
            <CardTitle className="text-base md:text-lg">Height</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <p className="text-xl md:text-2xl font-bold">{height} cm</p>
          </CardContent>
        </Card>
        <Card 
          className="bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={onWeightClick}
        >
          <CardHeader className="p-2 md:p-4">
            <CardTitle className="text-base md:text-lg">Weight</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <p className="text-xl md:text-2xl font-bold">{weight} kg</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
