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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface SettingsProps {
  overlayOpacity: number;
  onOverlayOpacityChange: (newOpacity: number) => void;
  isSearchVisible: boolean;
  onToggleSearchVisibility: () => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  overlayOpacity, 
  onOverlayOpacityChange, 
  isSearchVisible, 
  onToggleSearchVisibility 
}) => {
  return (
    <div className="absolute bottom-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-full bg-transparent hover:bg-white/10 transition-colors">
            <SettingsIcon className="w-6 h-6 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-white text-gray-800 p-2 rounded-lg shadow-lg">
          <DropdownMenuLabel className="text-lg font-semibold px-2 py-1">Settings</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200" />
          <DropdownMenuItem className="focus:bg-gray-100 rounded">
            <div className="w-full px-2 py-1">
              <label className="block mb-2 text-sm font-medium">Background Overlay</label>
              <Slider
                value={[overlayOpacity]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={([value]) => onOverlayOpacityChange(value)}
                className="w-full"
              />
              <div className="text-right mt-1 text-sm">
                {Math.round(overlayOpacity * 100)}%
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-gray-100 rounded">
            <div className="w-full px-2 py-1 flex items-center justify-between">
              <label className="text-sm font-medium">Show Google Search</label>
              <Switch
                checked={isSearchVisible}
                onCheckedChange={onToggleSearchVisibility}
              />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Settings;