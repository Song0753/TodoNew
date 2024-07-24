"use client";
import React, { useState, useEffect, useCallback } from "react";
import TodoList from "./TodoList";
import OnboardingFlow from "./Onboarding";
import Background from "./Background";
import TopPriority from "./TopPriority";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [userName, setUserName] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [topPriority, setTopPriority] = useState<string | null>(null);
  const [isTopPriorityChecked, setIsTopPriorityChecked] = useState(false);
  const [showTodoList, setShowTodoList] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedTodos = localStorage.getItem("todos");
    if (storedName) {
      setUserName(storedName);
      setIsOnboardingComplete(true);
    }
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
    setIsLoading(false);
  }, []);

  const updateTopPriority = useCallback(() => {
    const incompleteTodos = todos.filter((todo) => !todo.completed);
    const newTopPriority =
      incompleteTodos.length > 0 ? incompleteTodos[0].text : null;
    setTopPriority(newTopPriority);
    setIsTopPriorityChecked(false); // Reset checkbox when top priority changes
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    updateTopPriority();
  }, [todos, updateTopPriority]);

  const handleOnboardingComplete = (name: string, priority: string) => {
    setUserName(name);
    setTodos([
      {
        id: Date.now().toString(),
        text: priority,
        completed: false,
        date: new Date().toISOString().split("T")[0],
      },
    ]);
    setIsOnboardingComplete(true);
    localStorage.setItem("userName", name);
  };

  const handleCompletePriority = () => {
    const newTodos = todos.map((todo) =>
      todo.text === topPriority ? { ...todo, completed: true } : todo
    );
    setTodos(newTodos);
    setIsTopPriorityChecked(true); // Set checkbox to checked
    // The updateTopPriority in useEffect will handle updating to the next priority
  };

  if (isLoading) {
    return (
      <Background>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      </Background>
    );
  }

  if (!isOnboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <Background>
      {showTodoList ? (
        <TodoList
          userName={userName}
          todos={todos}
          onClose={() => setShowTodoList(false)}
          onTodosChange={setTodos}
        />
      ) : (
        <TopPriority
          userName={userName}
          topPriority={topPriority}
          isChecked={isTopPriorityChecked}
          onOpenTodoList={() => setShowTodoList(true)}
          onCompletePriority={handleCompletePriority}
        />
      )}
    </Background>
  );
}
