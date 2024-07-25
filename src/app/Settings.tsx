import React from "react";
import { Settings as SettingsIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Settings: React.FC = () => {
  return (
    <div className="absolute bottom-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-full bg-transparent hover:bg-white/10 transition-colors">
            <SettingsIcon className="w-6 h-6 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Preferences</DropdownMenuItem>
          <DropdownMenuItem>Help</DropdownMenuItem>
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Settings;
