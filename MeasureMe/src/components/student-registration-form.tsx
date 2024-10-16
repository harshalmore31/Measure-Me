"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Upload } from 'lucide-react'
import axios from 'axios'

interface StudentRegistrationFormProps {
  onClose: () => void;
  initialData?: Partial<Student>;
  onSubmit?: (data: Partial<Student>) => void;
}

interface Student {
  id: string;
  name: string;
  roll_number: string;
  standard: string;
  division: string;
  profile_photo: string;
}

export default function StudentRegistrationForm({ onClose, initialData, onSubmit }: StudentRegistrationFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    roll_number: initialData?.roll_number || '',
    standard: initialData?.standard || '',
    division: initialData?.division || '',
    profile_photo: null as File | null,
    trainingImages: [] as File[],
  })
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (name === 'profile_photo') {
      setFormData(prevData => ({ ...prevData, [name]: files?.[0] || null }))
    } else if (name === 'trainingImages' && files) {
      setFormData(prevData => ({ ...prevData, [name]: [...prevData.trainingImages, ...Array.from(files)] }))
    }
  }

  const handleNext = () => {
    setStep(prevStep => prevStep + 1)
  }

  const handlePrevious = () => {
    setStep(prevStep => prevStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const allTrainingImages = [...formData.trainingImages, ...capturedImages.map(dataUrl => {
      const arr = dataUrl.split(',')
      const mime = arr[0].match(/:(.*?);/)![1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `captured_image_${n}.jpg`, { type: mime })
    })]

    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && key !== 'trainingImages') {
          data.append(key, value.toString())
        }
      })
      if (formData.profile_photo) {
        data.append('profile_photo', formData.profile_photo)
      }
      allTrainingImages.forEach((image, index) => {
        data.append(`training_images`, image)
      })

      if (initialData && onSubmit) {
        onSubmit(Object.fromEntries(data))
      } else {
        const response = await axios.post('http://localhost:8000/api/students/', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log('Student registered successfully:', response.data)
      }

      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
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
    <Card>
      <CardHeader>
        <CardTitle>Student Registration</CardTitle>
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
        <form onSubmit={handleSubmit}>
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
                  required
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
                    <Label htmlFor="trainingImages">Training Images (up to 400)</Label>
                    <Input
                      id="trainingImages"
                      name="trainingImages"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple
                    />
                    <p className="text-sm text-muted-foreground">
                      Selected: {formData.trainingImages.length} images
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
      <CardFooter className="flex justify-between">
        {step > 1 && (
          <Button onClick={handlePrevious} variant="outline">
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