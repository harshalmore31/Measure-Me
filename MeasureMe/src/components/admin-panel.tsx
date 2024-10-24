"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { PencilIcon, TrashIcon, UserPlus, Users, Image as ImageIcon } from "lucide-react"
import axios from "axios"
import StudentRegistrationForm from "./student-registration-form"

interface Student {
  id: string;
  name: string;
  roll_number: string;
  standard: string;
  division: string;
  profile_photo: string;
  height: number | undefined;
  weight: number | undefined;
  training_images: string[];
}


export default function AdminPanel() {
  const [students, setStudents] = useState<Student[]>([])
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await axios.get<Student[]>("http://localhost:8000/api/students/")
      console.log("Fetched students:", response.data)
      setStudents(response.data)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const handleAddStudent = async (formData: FormData) => {
    try {
      const response = await axios.post("http://localhost:8000/api/students/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log("New student added:", response.data)
      setIsRegistrationFormOpen(false)
      fetchStudents()
    } catch (error) {
      console.error("Error adding student:", error)
    }
  }

  const handleDeleteStudent = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/students/${id}/`)
      fetchStudents()
    } catch (error) {
      console.error("Error deleting student:", error)
    }
  }

  const handleUpdateStudent = async (id: string, formData: FormData) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/students/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log("Student updated:", response.data)
      setEditingStudent(null)
      fetchStudents()
    } catch (error) {
      console.error("Error updating student:", error)
    }
  }

 
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
  )


  const calculateAverageBMI = () => {
    if (students.length === 0) return "N/A";
    const validStudents = students.filter(student => student.height && student.weight);
    if (validStudents.length === 0) return "N/A";
    const totalBMI = validStudents.reduce((sum, student) => {
      const heightInMeters = student.height! / 100;
      const bmi = student.weight! / (heightInMeters * heightInMeters);
      return sum + bmi;
    }, 0);
    return (totalBMI / validStudents.length).toFixed(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow py-6">
        <div className="max-w-[calc(100%-120px)] mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Student Management</h2>
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button onClick={() => setIsRegistrationFormOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Latest Registration</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students[students.length - 1]?.name || "N/A"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average BMI</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateAverageBMI()}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Standard</TableHead>
                    <TableHead>Division</TableHead>
                    <TableHead>Height (cm)</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={student.profile_photo} alt={student.name} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.roll_number}</TableCell>
                      <TableCell>{student.standard}</TableCell>
                      <TableCell>{student.division}</TableCell>
                      <TableCell>{student.height ?? 'N/A'}</TableCell>
                      <TableCell>{student.weight ?? 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-black text-white hover:bg-gray-800"
                            onClick={() => setEditingStudent(student)}
                          >
                            <PencilIcon className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-black text-white hover:bg-gray-800"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <TrashIcon className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                className="bg-black text-white hover:bg-gray-800"
                              >
                                <ImageIcon className="h-3 w-3 mr-1" />
                                Images
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <h3 className="text-lg font-semibold mb-4">Training Images for {student.name}</h3>
                              <div className="grid grid-cols-3 gap-4">
                                {student.training_images.map((image, index) => (
                                  <img key={index} src={image} alt={`Training image ${index + 1}`} className="w-full h-auto rounded-md" />
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isRegistrationFormOpen} onOpenChange={setIsRegistrationFormOpen}>
        <DialogContent>
          <StudentRegistrationForm 
            onClose={() => setIsRegistrationFormOpen(false)}
            onSubmit={handleAddStudent}
          />
        </DialogContent>
      </Dialog>

      {editingStudent && (
        <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
          <DialogContent>
            <StudentRegistrationForm
              onClose={() => setEditingStudent(null)}
              initialData={editingStudent}
              onSubmit={(formData) => handleUpdateStudent(editingStudent.id, formData)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
