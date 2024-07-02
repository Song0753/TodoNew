import React, { useState, useEffect } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import TodoPopup from "./TodoPopup"; // TodoPopup 컴포넌트를 import

export function CardWithForm() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [todos, setTodos] = useState([]);
  // 컴포넌트가 마운트될 때 TodoPopup을 표시하기 위해 isPopupVisible을 true로 설정
  useEffect(() => {
    setPopupVisible(true);
  }, []);

  const handleAddTodo = (date, text) => {
    setTodos([...todos, { id: Date.now(), date, text }]);
  };

  const handleEditTodo = (id) => {
    // Edit todo logic here
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  return (
    <TodoPopup
      isVisible={isPopupVisible}
      onClose={() => setPopupVisible(false)}
      todos={todos}
      onAddTodo={handleAddTodo}
      onEditTodo={handleEditTodo}
      onDeleteTodo={handleDeleteTodo}
    />
  );
}

export default CardWithForm;
