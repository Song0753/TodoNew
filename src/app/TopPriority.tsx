import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TopPriorityProps {
  userName: string;
  topPriority: string | null;
  isChecked: boolean;
  onOpenTodoList: () => void;
  onCompletePriority: () => void;
}

const TopPriority: React.FC<TopPriorityProps> = ({
  userName,
  topPriority,
  isChecked,
  onOpenTodoList,
  onCompletePriority,
}) => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold text-white">
        Wishing you a delightful day! {userName}
      </h1>
      {topPriority ? (
        <div className="flex items-center justify-center space-x-2">
          <Checkbox
            id="priority-checkbox"
            checked={isChecked}
            onCheckedChange={onCompletePriority}
            className="border-white"
          />
          <label htmlFor="priority-checkbox" className="text-white">
            {topPriority}
          </label>
        </div>
      ) : (
        <p className="text-white">
          Great job! You've completed all your tasks for today.
        </p>
      )}
      <Button
        onClick={onOpenTodoList}
        className="bg-white/10 hover:bg-white/20 text-white"
      >
        Open Todo List
      </Button>
    </div>
  );
};

export default TopPriority;
