"use client"

import { useState } from "react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const generateWeightData = (startWeight: number, years: number) => {
  const data = []
  let currentWeight = startWeight

  for (let year = 2020; year < 2020 + years; year++) {
    const firstHalf = currentWeight + (Math.random() - 0.5) * 4
    currentWeight = firstHalf + (Math.random() - 0.5) * 4

    data.push(
      { period: `${year} Jan-Jun`, weight: Number(firstHalf.toFixed(1)) },
      { period: `${year} Jul-Dec`, weight: Number(currentWeight.toFixed(1)) }
    )
  }

  return data
}

const chartData = generateWeightData(70, 4)

const chartConfig = {
  weight: {
    label: "Weight",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface WeightChartProps {
  onBack: () => void
}

export default function WeightChart({ onBack }: WeightChartProps) {
  const [fact, setFact] = useState("")
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus("Submitting...")
    
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitStatus("Fact submitted successfully!")
    setFact("")
  }

  return (
    <div className="flex flex-col items-center w-full"> {/* Removed bg-background */}
      <Button onClick={onBack} className="mb-4 self-start">Back to Dashboard</Button>
      <div className="flex flex-col items-center min-h-screen bg-background p-4">
        <div className="w-full max-w-[1240px] flex flex-col md:flex-row gap-4 mb-4">
          <Card className="flex-1 max-w-[800px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Weight Timeline</CardTitle>
              <CardDescription>Semi-annual weight measurements over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 20,
                    left: 40,
                    right: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', offset: -20 }}
                    domain={['dataMin - 5', 'dataMax + 5']}
                    fontSize={12}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="weight"
                    type="monotone"
                    stroke="var(--color-weight)"
                    strokeWidth={2}
                    dot={{
                      fill: "var(--color-weight)",
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  >
                    <LabelList
                      dataKey="weight"
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={10}
                    />
                  </Line>
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="w-full md:w-[400px]">
            <CardHeader>
              <CardTitle className="text-xl">Key Weight Facts</CardTitle>
              <CardDescription>Factors influencing body weight</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-semibold">Metabolism:</span> Basal metabolic rate accounts for 60-75% of daily calorie expenditure.
                </li>
                <li>
                  <span className="font-semibold">Diet:</span> Caloric intake vs. expenditure is crucial for weight management.
                </li>
                <li>
                  <span className="font-semibold">Exercise:</span> Physical activity helps burn calories and build muscle mass.
                </li>
                <li>
                  <span className="font-semibold">Genetics:</span> Can influence body type, fat distribution, and weight gain tendencies.
                </li>
                <li>
                  <span className="font-semibold">Sleep:</span> Lack of sleep can disrupt hormones that regulate hunger and appetite.
                </li>
                <li>
                  <span className="font-semibold">Hydration:</span> Proper water intake supports metabolism and can aid in weight management.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full max-w-[1240px]">
          <CardHeader>
            <CardTitle className="text-xl">Submit a Weight Fact</CardTitle>
            <CardDescription>Share your knowledge about body weight and health</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fact">Weight Fact</Label>
                <Textarea
                  id="fact"
                  placeholder="Enter an interesting fact about weight or weight management..."
                  value={fact}
                  onChange={(e) => setFact(e.target.value)}
                  required
                />
              </div>
              <Button type="submit">Submit Fact</Button>
            </form>
            {submitStatus && (
              <p className="mt-4 text-sm text-green-600">{submitStatus}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}