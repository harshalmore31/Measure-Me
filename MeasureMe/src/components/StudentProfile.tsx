import { Card, CardContent } from "@/components/ui/card"

export default function StudentInfo() {
  return (
    <Card className="bg-gray-100">
      <CardContent className="p-6">
        <div className="w-full max-w-[240px] aspect-square bg-white mb-4 mx-auto"></div>
        <div className="space-y-1">
          <p><strong>Name:</strong> Harshal More</p>
          <p><strong>Roll No:</strong> 31</p>
          <p><strong>DIV:</strong> A</p>
          <p><strong>STD:</strong> 8th</p>
        </div>
      </CardContent>
    </Card>
  )
}