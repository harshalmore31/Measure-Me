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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface HeightChartProps {
  onBack: () => void
}

const generateHeightData = (startHeight: number, years: number) => {
  const data = []
  let currentHeight = startHeight

  for (let year = 2020; year < 2020 + years; year++) {
    const firstHalf = currentHeight + Math.random() * 2
    currentHeight = firstHalf + Math.random() * 2

    data.push(
      { period: `${year} Jan-Jun`, height: Number(firstHalf.toFixed(1)) },
      { period: `${year} Jul-Dec`, height: Number(currentHeight.toFixed(1)) }
    )
  }

  return data
}

const chartData = generateHeightData(150, 4)

const chartConfig = {
  height: {
    label: "Height",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function HeightChart({ onBack }: HeightChartProps) {
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
              <CardTitle className="text-2xl">Height Timeline</CardTitle>
              <CardDescription>Semi-annual height measurements over time</CardDescription>
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
                    label={{ value: 'Height (cm)', angle: -90, position: 'insideLeft', offset: -20 }}
                    domain={['dataMin - 5', 'dataMax + 5']}
                    fontSize={12}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="height"
                    type="monotone"
                    stroke="var(--color-height)"
                    strokeWidth={2}
                    dot={{
                      fill: "var(--color-height)",
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  >
                    <LabelList
                      dataKey="height"
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
              <CardTitle className="text-xl">Key Height Facts</CardTitle>
              <CardDescription>Factors influencing human height</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-semibold">Growth Spurts:</span> Major growth occurs during infancy and puberty.
                </li>
                <li>
                  <span className="font-semibold">Genetics:</span> About 80% of height is determined by genes.
                </li>
                <li>
                  <span className="font-semibold">Nutrition:</span> Proper diet is crucial for reaching full height potential.
                </li>
                <li>
                  <span className="font-semibold">Sleep:</span> Growth hormone is primarily released during deep sleep.
                </li>
                <li>
                  <span className="font-semibold">Final Height:</span> Most reach their adult height by age 18-20.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full max-w-[1240px]">
          <CardHeader>
            <CardTitle className="text-xl">Submit a Height Fact</CardTitle>
            <CardDescription>Share your knowledge about human height</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fact">Height Fact</Label>
                <Textarea
                  id="fact"
                  placeholder="Enter an interesting fact about height..."
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