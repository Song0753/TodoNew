"use client";
import React, { useState, useEffect, useCallback } from "react";
import TodoList from "./TodoList";
import OnboardingFlow from "./Onboarding";
import Background from "./Background";
import TopPriority from "./TopPriority";
import Settings from "./Settings";

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
  const [overlayOpacity, setOverlayOpacity] = useState(0.2);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedTodos = localStorage.getItem("todos");
    if (storedName) {
      setUserName(storedName);
      setIsOnboardingComplete(true);
    }
    if (storedTodos) {
      const parsedTodos = JSON.parse(storedTodos);
      setTodos(parsedTodos);
      updateTopPriority(parsedTodos);
    }
    setIsLoading(false);
  }, []);

  const updateTopPriority = useCallback((currentTodos: Todo[]) => {
    const incompleteTodos = currentTodos.filter((todo) => !todo.completed);
    const newTopPriority =
      incompleteTodos.length > 0 ? incompleteTodos[0].text : null;
    setTopPriority(newTopPriority);
    setIsTopPriorityChecked(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    updateTopPriority(todos);
  }, [todos, updateTopPriority]);

  const handleOnboardingComplete = (name: string, priority: string | null) => {
    setUserName(name);
    const newTodos = priority
      ? [
          {
            id: Date.now().toString(),
            text: priority,
            completed: false,
            date: new Date().toISOString().split("T")[0],
          },
        ]
      : [];
    setTodos(newTodos);
    updateTopPriority(newTodos);
    setIsOnboardingComplete(true);
    localStorage.setItem("userName", name);
  };

  const handleCompletePriority = () => {
    const newTodos = todos.map((todo) =>
      todo.text === topPriority ? { ...todo, completed: true } : todo
    );
    setTodos(newTodos);
    setIsTopPriorityChecked(true);
    updateTopPriority(newTodos);
  };

  const handleOpenTodoList = () => {
    setShowTodoList(true);
  };

  const handleOverlayOpacityChange = (newOpacity: number) => {
    setOverlayOpacity(newOpacity);
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
    <Background overlayOpacity={overlayOpacity}>
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
          onOpenTodoList={handleOpenTodoList}
          onCompletePriority={handleCompletePriority}
          todos={todos}
        />
      )}
      <Settings 
        overlayOpacity={overlayOpacity} 
        onOverlayOpacityChange={handleOverlayOpacityChange}
      />
    </Background>
  );
}