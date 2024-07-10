import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Background from "./Background";
import TodoList from "./TodoList";

const WelcomeStep = ({ onNext }) => {
  const [nickname, setNickname] = useState("");

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Nice to meet you!</h2>
      <Input
        type="text"
        placeholder="Enter your nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder-white/50"
      />
      <Button onClick={() => onNext(nickname)} disabled={!nickname}>
        Continue
      </Button>
    </div>
  );
};

const TodoStep = ({ onNext }) => {
  const [todo, setTodo] = useState("");

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        What is your top priority to-do list?
      </h2>
      <Input
        type="text"
        placeholder="Enter your top priority"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder-white/50"
      />
      <Button onClick={() => onNext(todo)} disabled={!todo}>
        START
      </Button>
    </div>
  );
};

const FinalStep = ({ nickname, todo }) => {
  const [isTodoListOpen, setIsTodoListOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        Wishing you a delightful day! {nickname}
      </h2>
      <div className="flex items-center space-x-2">
        <Checkbox id="todo" />
        <label
          htmlFor="todo"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {todo}
        </label>
      </div>
      <Button onClick={() => setIsTodoListOpen(true)}>Open Todo List</Button>
      {isTodoListOpen && <TodoList onClose={() => setIsTodoListOpen(false)} />}
    </div>
  );
};

const OnboardingFlow = () => {
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

  return (
    <Background>
      {step === 0 && <WelcomeStep onNext={handleWelcomeNext} />}
      {step === 1 && <TodoStep onNext={handleTodoNext} />}
      {step === 2 && <FinalStep nickname={nickname} todo={todo} />}
    </Background>
  );
};

export default OnboardingFlow;
