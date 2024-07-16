"use client";
import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Check,
  GripVertical,
} from "lucide-react";
import styles from "./TodoList.module.css";
import { Checkbox } from "@/components/ui/checkbox";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

interface TodoListProps {
  onClose: () => void;
  userName: string;
  initialTodo: string;
  onPriorityTodoChange: (newPriorityTodo: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  onClose,
  userName,
  initialTodo,
  onPriorityTodoChange,
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
          id: Date.now().toString(),
          text: initialTodo,
          completed: false,
          date: new Date().toISOString().split("T")[0],
        },
      ];
    }
    return [];
  });
  const [priorityTodo, setPriorityTodo] = useState<string>(initialTodo);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    updatePriorityTodo();
  }, [todos]);
  const updatePriorityTodo = () => {
    const incompleteTodos = todos.filter((todo) => !todo.completed);
    if (incompleteTodos.length > 0) {
      const newPriorityTodo = incompleteTodos[0].text;
      setPriorityTodo(newPriorityTodo);
      onPriorityTodoChange(newPriorityTodo);
    } else {
      setPriorityTodo("");
      onPriorityTodoChange("");
    }
  };

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
          id: Date.now().toString(),
          text: newTodo,
          completed: false,
          date: selectedDate.toISOString().split("T")[0],
        },
      ]);
      setNewTodo("");
    }
  }, [newTodo, selectedDate]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const toggleTodo = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  const startEditing = (id: string, text: string) => {
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

  const deleteTodo = (id: string) => {
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

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newTodos = Array.from(todos);
    const [reorderedItem] = newTodos.splice(result.source.index, 1);
    newTodos.splice(result.destination.index, 0, reorderedItem);

    setTodos(newTodos);
  };

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

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={styles.todoList}
                >
                  {filteredTodos.map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={styles.todoItem}
                        >
                          <div className={styles.dragHandle}>
                            <GripVertical size={20} />
                          </div>
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
                                  onClick={() =>
                                    startEditing(todo.id, todo.text)
                                  }
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className={styles.addTodoSection}>
            <input
              type="text"
              placeholder="Add a new todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.addTodoInput}
            />
            <button
              onClick={addTodo}
              className={styles.addTodoButton}
              disabled={!newTodo.trim()}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
