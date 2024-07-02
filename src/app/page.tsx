"use client";
import React, { useState, useEffect } from "react";
import TodoPopup from "./TodoPopup";
import { format } from "date-fns";
import CardWithForm from "./CreateCard";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const [cardFormVisible, setCardFormVisible] = useState(false); // CardWithForm 컴포넌트의 표시 여부를 제어하는 상태
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Button onClick={() => setCardFormVisible(true)}>Todo list open</Button>{" "}
        {/* CardWithForm을 열기 위한 버튼 추가 */}
        {cardFormVisible && (
          <div className="relative">
            <CardWithForm />
            <button
              className="absolute top-0 right-0"
              onClick={() => setCardFormVisible(false)}
            >
              Close
            </button>
          </div>
        )}{" "}
        {/* 조건부 렌더링을 사용하여 CardWithForm 컴포넌트 표시 및 닫기 버튼 추가 */}
      </div>
    </main>
  );
}
