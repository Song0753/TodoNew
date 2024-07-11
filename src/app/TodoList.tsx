import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Check,
} from "lucide-react";
import styles from "./TodoList.module.css";
import { Checkbox } from "@/components/ui/checkbox";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;
}

interface TodoListProps {
  onClose: () => void;
  userName: string;
  initialTodo: string;
}

const TodoList: React.FC<TodoListProps> = ({
  onClose,
  userName,
  initialTodo,
}) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Initialize todos from localStorage
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      return JSON.parse(storedTodos);
    }
    // 초기 할 일 추가
    if (initialTodo) {
      return [
        {
          id: Date.now(),
          text: initialTodo,
          completed: false,
          date: new Date().toISOString().split("T")[0],
        },
      ];
    }
    return [];
  });
  const [newTodo, setNewTodo] = useState("");
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

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
  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editingId === null) return;
    setTodos(
      todos.map((todo) =>
        todo.id === editingId ? { ...todo, text: editText } : todo
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
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
    return (
      date.toISOString().split("T")[0] ===
      selectedDate.toISOString().split("T")[0]
    );
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
                <div className={styles.todoItemContent}>
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className={`${styles.transparentCheckbox} ${styles.customCheckbox}`}
                  />
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className={styles.editInput}
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`${styles.todoText} ${
                        todo.completed ? styles.completedTodo : ""
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>
                <div className={styles.todoActions}>
                  {editingId === todo.id ? (
                    <>
                      <button
                        className={styles.actionButton}
                        onClick={saveEdit}
                      >
                        <Check size={20} />
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={cancelEdit}
                      >
                        <X size={20} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={styles.actionButton}
                        onClick={() => startEditing(todo.id, todo.text)}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => deleteTodo(todo.id)}
                      >
                        <Trash2 size={20} />
                      </button>
                    </>
                  )}
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
