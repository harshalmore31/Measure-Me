"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, X } from 'lucide-react'

interface StudentRegistrationFormProps {
  onClose: () => void
  initialData?: {
    id?: string
    name: string
    roll_number: string
    standard: string
    division: string
    profile_photo?: string
    height?: number
    weight?: number
  }
  onSubmit: (data: FormData) => void
}

export default function StudentRegistrationForm({ onClose, initialData, onSubmit }: StudentRegistrationFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    roll_number: initialData?.roll_number || '',
    standard: initialData?.standard || '',
    division: initialData?.division || '',
    profile_photo: null as File | null,
    training_images: [] as File[],
    height: initialData?.height || '',
    weight: initialData?.weight || '',
  })
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (name === 'profile_photo') {
      setFormData(prevData => ({ ...prevData, [name]: files?.[0] || null }))
    } else if (name === 'training_images' && files) {
      setFormData(prevData => ({ ...prevData, [name]: [...prevData.training_images, ...Array.from(files)] }))
    }
  }

  const handleNext = () => setStep(prevStep => prevStep + 1)
  const handlePrevious = () => setStep(prevStep => prevStep - 1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = new FormData()
    submitData.append('name', formData.name)
    submitData.append('roll_number', formData.roll_number)
    submitData.append('standard', formData.standard)
    submitData.append('division', formData.division)
    if (formData.profile_photo) {
      submitData.append('profile_photo', formData.profile_photo)
    }
    if (formData.height) {
      submitData.append('height', formData.height.toString())
    }
    if (formData.weight) {
      submitData.append('weight', formData.weight.toString())
    }
    formData.training_images.forEach((image) => {
      submitData.append('training_images', image)
    })
    onSubmit(submitData)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing the camera", err)
    }
  }

  const captureImage = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (video && canvas) {
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageDataUrl = canvas.toDataURL('image/jpeg')
        setCapturedImages(prev => [...prev, imageDataUrl])
      }
    }
  }

  return (
    <Card className="relative">
      <Button
        className="absolute top-2 right-2 bg-black text-white "
        size="sm"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </Button>
      
      <CardHeader>
        <CardTitle>{initialData ? "Edit Student" : "Add New Student"}</CardTitle>
        <CardDescription>Register a student for height and weight tracking</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-8 px-4">
          <div className="flex justify-between mb-2">   
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full flex items-center">
                <div
                  className={`h-2 w-full rounded-full ${
                    step >= i ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
                {i < 3 && <div className="w-4" />}
              </div>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Student Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roll_number">Roll Number</Label>
                  <Input
                    id="roll_number"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="standard">Standard/Grade</Label>
                  <Select name="standard" onValueChange={(value) => setFormData(prev => ({ ...prev, standard: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i} value={`${i + 1}`}>{`${i + 1}th`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="division">Division/Section</Label>
                  <Select name="division" onValueChange={(value) => setFormData(prev => ({ ...prev, division: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select division" />
                    </SelectTrigger>
                    <SelectContent>
                      {['A', 'B', 'C', 'D'].map((div) => (
                        <SelectItem key={div} value={div}>{div}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile_photo">Profile Photo</Label>
                <Input
                  id="profile_photo"
                  name="profile_photo"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload Images</TabsTrigger>
                  <TabsTrigger value="capture" onClick={startCamera}>Capture Images</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <div className="space-y-2">
                    <Label htmlFor="training_images">Training Images (up to 400)</Label>
                    <Input
                      id="training_images"
                      name="training_images"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple
                    />
                    <p className="text-sm text-muted-foreground">
                      Selected: {formData.training_images.length} images
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="capture">
                  <div className="space-y-4">
                    <video ref={videoRef} autoPlay className="w-full h-64 bg-black" />
                    <Button onClick={captureImage} className="w-full">
                      <Camera className="w-4 h-4 mr-2" />
                      Capture Image
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Captured: {capturedImages.length} images
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {capturedImages.map((img, index) => (
                        <img key={index} src={img} alt={`Captured ${index + 1}`} className="w-full h-auto" />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480" />
            </div>
          )}
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        {step > 1 && (
          <Button onClick={handlePrevious} variant="outline" className="mr-2">
            Previous
          </Button>
        )}
        {step < 3 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>Submit</Button>
        )}
      </CardFooter>
    </Card>
  )
}
