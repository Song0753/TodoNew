"use client";
import React, { useState, useEffect } from "react";
import TodoList from "./TodoList";
import OnboardingFlow from "./Onboarding";
import Background from "./Background";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [userName, setUserName] = useState("");
  const [topPriority, setTopPriority] = useState("");
  const [showTodoList, setShowTodoList] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedPriority = localStorage.getItem("topPriority");
    if (storedName && storedPriority) {
      setUserName(storedName);
      setTopPriority(storedPriority);
      setIsOnboardingComplete(true);
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (name, priority) => {
    setUserName(name);
    setTopPriority(priority);
    localStorage.setItem("userName", name);
    localStorage.setItem("topPriority", priority);
    setIsOnboardingComplete(true);
    setShowTodoList(true);
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
          initialTodo={topPriority}
          onClose={() => setShowTodoList(false)}
        />
      ) : (
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">
            Wishing you a delightful day! {userName}
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <input type="checkbox" checked readOnly className="border-white" />
            <span className="text-white">{topPriority}</span>
          </div>
          <Button
            onClick={() => setShowTodoList(true)}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Open Todo List
          </Button>
        </div>
      )}
    </Background>
  );
}
