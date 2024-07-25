import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Background from "./Background";
import Image from "next/image";
import TopPriority from "./TopPriority";

const continueButtonPath = "/ContinueButton/ContinueButton.svg";
const WelcomeStep = ({ onNext, initialName }) => {
  const [nickname, setNickname] = useState(initialName);
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
      localStorage.setItem("userName", nickname);
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
            outline: "none",
            boxShadow: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            fontSize: "56px",
            height: "80px",
            width: `${inputWidth}px`,
            minWidth: "320px",
            maxWidth: "600px",
            textAlign: "center",
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
    ${!nickname.trim() ? "opacity-50" : "hover:bg-white/20"}
  `}
        style={{
          width: "200px", // 이미지 너비와 일치
          height: "50px", // 이미지 높이와 일치
        }}
      >
        <Image
          src="/ContinueButton/ContinueButton.svg"
          alt="Continue"
          width={200}
          height={50}
          layout="responsive" // 반응형 레이아웃 사용
        />
      </div>
    </div>
  );
};

const TodoStep = ({ onNext, initialTodo }) => {
  const [todo, setTodo] = useState(initialTodo);
  const [inputWidth, setInputWidth] = useState(320);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const calculateWidth = () => {
      const textWidth = todo.length * 28; // 28px는 fontSize의 절반 정도로 설정
      return Math.max(320, Math.min(textWidth, 600));
    };

    setInputWidth(calculateWidth());
  }, [todo]);

  useEffect(() => {
    // 컴포넌트가 마운트되면 자동으로 입력 필드에 포커스를 줍니다.
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleStart = () => {
    // 빈 문자열이어도 다음 단계로 진행합니다.
    onNext(todo.trim() || null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleStart();
    }
  };

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-2xl text-white">
        What is your top priority to-do list?
      </h2>
      <p className="text-white text-sm">
        (You can leave this blank and add tasks later)
      </p>
      <div className="relative flex justify-center">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Enter your top priority (optional)"
          value={todo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTodo(e.target.value)
          }
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
            outline: "none",
            boxShadow: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            fontSize: "28px",
            height: "80px",
            width: `${inputWidth}px`,
            minWidth: "320px",
            maxWidth: "600px",
            textAlign: "center",
          }}
        />
      </div>
      <div
        onClick={handleStart}
        className={`
          inline-block
          cursor-pointer 
          transition-all duration-300 ease-in-out
          overflow-hidden
          rounded-[25px]
          hover:bg-white/20
        `}
        style={{
          width: "200px",
          height: "50px",
        }}
      >
        <Image
          src="/ContinueButton/ContinueButton.svg"
          alt="Continue"
          width={200}
          height={50}
          layout="responsive"
        />
      </div>
    </div>
  );
};

const FinalStep = ({ nickname, todo, onComplete }) => (
  <TopPriority
    userName={nickname}
    topPriority={todo}
    onOpenTodoList={() => onComplete(nickname, todo)}
  />
);

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");
  const [todo, setTodo] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setNickname(storedName);
      setStep(1); // TodoStep으로 바로 이동
    }
  }, []);

  const handleWelcomeNext = (name) => {
    setNickname(name);
    setStep(1);
  };

  const handleTodoNext = (task) => {
    setTodo(task);
    onComplete(nickname, task); // 바로 onComplete 호출
  };

  return (
    <Background overlayOpacity={0.2} showClock={true}>
      <div className="w-full max-w-md mx-auto">
        {step === 0 && (
          <WelcomeStep onNext={handleWelcomeNext} initialName={nickname} />
        )}
        {step === 1 && <TodoStep onNext={handleTodoNext} initialTodo={todo} />}
      </div>
    </Background>
  );
};

export default OnboardingFlow;
