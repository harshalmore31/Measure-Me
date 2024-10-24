import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationHeaderProps {
  onAdminPanelClick: () => void;
  onHomeClick: () => void;
}

export default function NavigationHeader({ onAdminPanelClick, onHomeClick }: NavigationHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-[#044149] text-white w-full">
      <div className="px-4 md:px-[190px] py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold cursor-pointer" onClick={onHomeClick}>Measure Me</h1>
        <nav className="hidden md:flex gap-6 items-center">
          <a href="#" className="relative group text-white hover:text-white" onClick={onAdminPanelClick}>
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
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#033139] p-4">
          <a href="#" className="block py-2 text-white" onClick={onAdminPanelClick}>Admin Panel</a>
          <a href="#" className="block py-2 text-white">About Us</a>
          <a href="#" className="block py-2 text-white">Account Details</a>
          <a href="#" className="block py-2 text-white">Settings</a>
          <a href="#" className="block py-2 text-white">Logout</a>
        </div>
      )}
    </header>
  )
}
