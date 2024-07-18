import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Background from "./Background";
import Image from 'next/image';

const continueButtonPath = '/ContinueButton/ContinueButton.svg';
const WelcomeStep = ({ onNext }) => {
  const [nickname, setNickname] = useState("");
  const [inputWidth, setInputWidth] = useState(320);
  const inputRef = useRef(null);

  useEffect(() => {
    const calculateWidth = () => {
      const textWidth = nickname.length * 56; // 56px는 fontSize와 대략적으로 일치
      return Math.max(320, Math.min(textWidth, 600));
    };

    setInputWidth(calculateWidth());
  }, [nickname]);

  const handleContinue = () => {
    if (nickname.trim()) {
      onNext(nickname);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && nickname.trim()) {
      handleContinue();
    }
  };

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-2xl text-white">Nice to meet you!</h2>
      <div className="relative flex justify-center">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Google Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyPress={handleKeyPress}
          className="
            bg-transparent 
            border-0 border-b-2 border-white/50 
            text-white placeholder-white/50 
            focus:outline-none focus:ring-0 focus:border-white 
            transition-all duration-300
            px-0 py-4
            rounded-none
            custom-no-outline-input
            text-center
          "
          style={{
            outline: 'none',
            boxShadow: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            fontSize: '56px',
            height: '80px',
            width: `${inputWidth}px`,
            minWidth: '320px',
            maxWidth: '600px',
            textAlign: 'center',
          }}
        />
      </div>
      <div 
  onClick={handleContinue}
  className={`
    inline-block  // 인라인 블록으로 설정하여 내용물 크기에 맞춤
    cursor-pointer 
    transition-all duration-300 ease-in-out
    overflow-hidden  // 오버플로우 숨김
    rounded-[25px]
    ${!nickname.trim() ? 'opacity-50' : 'hover:bg-white/20'}
  `}
  style={{
    width: '200px',  // 이미지 너비와 일치
    height: '50px',  // 이미지 높이와 일치
  }}
>
  <Image 
    src="/ContinueButton/ContinueButton.svg"
    alt="Continue"
    width={200}
    height={50}
    layout="responsive"  // 반응형 레이아웃 사용
  />
</div>
    </div>
  );
};

const TodoStep = ({ onNext }) => {
  const [todo, setTodo] = useState("");

  const handleStart = () => {
    if (todo.trim()) {
      onNext(todo);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && todo.trim()) {
      handleStart();
    }
  };

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-2xl font-bold text-white">
        What is your top priority to-do list?
      </h2>
      <Input
        type="text"
        placeholder="Enter your top priority"
        value={todo}
        onKeyPress={handleKeyPress}
        onChange={(e) => setTodo(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder-white/50"
      />
      <Button
        onClick={() => onNext(todo)}
        disabled={!todo.trim()}
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
