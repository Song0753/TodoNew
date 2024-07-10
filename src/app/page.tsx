"use client";
import React, { useState, useEffect } from "react";
import TodoList from "./TodoList";
import Background from "./Background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const [showTodoList, setShowTodoList] = useState(false);

  useEffect(() => {
    // Load userName from localStorage
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
      setIsNameSet(true);
    }
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() !== "") {
      localStorage.setItem("userName", userName);
      setIsNameSet(true);
    }
  };

  return (
    <Background>
      <div className="container mx-auto p-4">
        {!isNameSet ? (
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <Input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            <Button
              type="submit"
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              Set Name
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white">
              Welcome, {userName}!
            </h1>
            <Button
              onClick={() => setShowTodoList(true)}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              Open Todo List
            </Button>
            {showTodoList && (
              <TodoList
                onClose={() => setShowTodoList(false)}
                userName={userName}
              />
            )}
          </div>
        )}
      </div>
    </Background>
  );
}
