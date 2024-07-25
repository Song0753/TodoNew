import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

interface TopPriorityProps {
  userName: string;
  topPriority: string | null;
  isChecked: boolean;
  onOpenTodoList: () => void;
  onCompletePriority: () => void;
  todos: Todo[];
}

const TopPriority: React.FC<TopPriorityProps> = ({
  userName,
  topPriority,
  isChecked,
  onOpenTodoList,
  onCompletePriority,
  todos,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const todayTodos = todos.filter((todo) => todo.date === today);

  const allTodosCompleted =
    todayTodos.length > 0 && todayTodos.every((todo) => todo.completed);
  const noTodosToday = todayTodos.length === 0;

  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold text-white mb-6">
        Wishing you a delightful day! {userName}
      </h1>
      <div className="flex items-center justify-center space-x-4">
        <div className="flex-grow">
          {noTodosToday ? (
            <p className="text-white text-2xl">
              You have no tasks for today. Click the button to add some!
            </p>
          ) : allTodosCompleted ? (
            <p className="text-white text-2xl">
              Great job! You've completed all your tasks for today.
            </p>
          ) : topPriority ? (
            <div className="flex items-center justify-center space-x-2">
              <Checkbox
                id="priority-checkbox"
                checked={isChecked}
                onCheckedChange={onCompletePriority}
                className="w-6 h-6 border-2 border-white"
              />
              <label
                htmlFor="priority-checkbox"
                className="text-white text-2xl"
              >
                {topPriority}
              </label>
            </div>
          ) : (
            <p className="text-white text-2xl">
              You have tasks for today. Keep going!
            </p>
          )}
        </div>
        <div
          onClick={onOpenTodoList}
          className="cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 flex-shrink-0"
        >
          <Image
            src="/TodoListButton.svg"
            alt="Open Todo List"
            width={24}
            height={24}
            layout="fixed"
          />
        </div>
      </div>
    </div>
  );
};

export default TopPriority;
