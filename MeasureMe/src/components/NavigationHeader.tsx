import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <header className="bg-[#044149] text-white w-full">
      <div className="px-[190px] py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Measure Me</h1>
        <nav className="flex gap-6 items-center">
          <a href="#" className="relative group text-white hover:text-white">
            Admin Panel
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#FFFB00] transition-all group-hover:w-full"></span>
          </a>
          <a href="#" className="relative group text-white hover:text-white">
            About Us
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#FFFB00] transition-all group-hover:w-full"></span>
          </a>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Account Details</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}