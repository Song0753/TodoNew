import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import styles from "./TodoList.module.css";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;
}

interface TodoListProps {
  onClose: () => void;
  userName: string;
}

const TodoList: React.FC<TodoListProps> = ({ onClose, userName }) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Initialize todos from localStorage
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState("");
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Save todos to localStorage whenever it changes
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback(() => {
    if (newTodo.trim() !== "") {
      setTodos((prevTodos) => [
        ...prevTodos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          date: selectedDate.toISOString().split("T")[0],
        },
      ]);
      setNewTodo("");
    }
  }, [newTodo, selectedDate]);

  const toggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const changeWeek = (weeks: number) => {
    setCurrentWeekStart((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + weeks * 7);
      return newDate;
    });
  };

  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const isSelectedDate = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const filteredTodos = todos.filter(
    (todo) => todo.date === selectedDate.toISOString().split("T")[0]
  );

  return (
    <div className={styles.todoListContainer}>
      <div className={styles.todoListCard}>
        <div className={styles.todoListContent}>
          <div className={styles.todoListHeader}>
            <h2 className={styles.todoListTitle}>To-Do List</h2>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.calendarSection}>
            <button
              className={styles.actionButton}
              onClick={() => changeWeek(-1)}
            >
              <ChevronLeft size={20} />
            </button>
            <div className={styles.calendarDays}>
              {getWeekDates().map((date, index) => (
                <div
                  key={index}
                  className={`${styles.dayColumn} ${
                    isSelectedDate(date) ? styles.selectedDate : ""
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className={styles.dayName}>
                    {
                      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                        date.getDay()
                      ]
                    }
                  </div>
                  <div className={styles.dateNumber}>{date.getDate()}</div>
                </div>
              ))}
            </div>
            <button
              className={styles.actionButton}
              onClick={() => changeWeek(1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className={styles.todoList}>
            {filteredTodos.map((todo) => (
              <div key={todo.id} className={styles.todoItem}>
                <div>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span
                    className={`${styles.todoText} ${
                      todo.completed ? styles.completedTodo : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <div className={styles.todoActions}>
                  <button className={styles.actionButton}>
                    <Edit size={16} />
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.addTodoSection}>
            <input
              type="text"
              placeholder="Add a new todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className={styles.addTodoInput}
            />
            <button onClick={addTodo} className={styles.addTodoButton}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
