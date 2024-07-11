import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Background from "./Background";

const WelcomeStep = ({ onNext }) => {
  const [nickname, setNickname] = useState("");

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-2xl font-bold text-white">Nice to meet you!</h2>
      <Input
        type="text"
        placeholder="Enter your name"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder-white/50"
      />
      <Button
        onClick={() => onNext(nickname)}
        disabled={!nickname}
        className="bg-white/10 hover:bg-white/20 text-white"
      >
        Continue
      </Button>
    </div>
  );
};

const TodoStep = ({ onNext }) => {
  const [todo, setTodo] = useState("");

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-2xl font-bold text-white">
        What is your top priority to-do list?
      </h2>
      <Input
        type="text"
        placeholder="Enter your top priority"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder-white/50"
      />
      <Button
        onClick={() => onNext(todo)}
        disabled={!todo}
        className="bg-white/10 hover:bg-white/20 text-white"
      >
        START
      </Button>
    </div>
  );
};

const FinalStep = ({ nickname, todo, onComplete }) => (
  <div className="space-y-4 text-center">
    <h2 className="text-2xl font-bold text-white">
      Wishing you a delightful day! {nickname}
    </h2>
    <div className="flex items-center space-x-2 justify-center">
      <input type="checkbox" checked readOnly className="border-white" />
      <span className="text-white">{todo}</span>
    </div>
    <Button
      onClick={(e) => {
        e.preventDefault(); // 기본 동작 방지
        onComplete(nickname, todo);
      }}
      className="bg-white/10 hover:bg-white/20 text-white"
    >
      Open Todo List
    </Button>
  </div>
);

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");
  const [todo, setTodo] = useState("");

  const handleWelcomeNext = (name) => {
    setNickname(name);
    setStep(1);
  };

  const handleTodoNext = (task) => {
    setTodo(task);
    setStep(2);
  };

  const handleOpenTodoList = () => {
    onComplete(nickname, todo);
  };

  return (
    <Background>
      <div className="w-full max-w-md mx-auto">
        {step === 0 && <WelcomeStep onNext={handleWelcomeNext} />}
        {step === 1 && <TodoStep onNext={handleTodoNext} />}
        {step === 2 && (
          <FinalStep nickname={nickname} todo={todo} onComplete={onComplete} />
        )}
      </div>
    </Background>
  );
};

export default OnboardingFlow;
