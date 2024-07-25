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
  Flower,
} from "lucide-react";
import styles from "./TodoList.module.css";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

interface TodoListProps {
  onClose: () => void;
  userName: string;
  todos: Todo[];
  onTodosChange: (newTodos: Todo[]) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  onClose,
  userName,
  todos,
  onTodosChange,
}) => {
  const [newTodo, setNewTodo] = useState("");
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const addTodo = useCallback(() => {
    if (newTodo.trim() !== "") {
      const newTodos = [
        ...todos,
        {
          id: Date.now().toString(),
          text: newTodo,
          completed: false,
          date: selectedDate.toISOString().split("T")[0],
        },
      ];
      onTodosChange(newTodos);
      setNewTodo("");
    }
  }, [newTodo, selectedDate, todos, onTodosChange]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const toggleTodo = (id: string) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    onTodosChange(newTodos);
  };

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editingId === null) return;
    const newTodos = todos.map((todo) =>
      todo.id === editingId ? { ...todo, text: editText } : todo
    );
    onTodosChange(newTodos);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    onTodosChange(newTodos);
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

    const sourceIndex = todos.findIndex(
      (todo) => todo.id === filteredTodos[result.source.index].id
    );
    const destinationIndex = todos.findIndex(
      (todo) => todo.id === filteredTodos[result.destination.index].id
    );

    const newTodos = Array.from(todos);
    const [reorderedItem] = newTodos.splice(sourceIndex, 1);
    newTodos.splice(destinationIndex, 0, reorderedItem);

    onTodosChange(newTodos);
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
                  {filteredTodos.length > 0 ? (
                    filteredTodos.map((todo, index) => (
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
                    ))
                  ) : (
                    <div className={styles.emptyTodoList}>
                      <Image
                        src="/flower/iconmonstr-flower-3.svg"
                        alt="Flower icon"
                        width={48}
                        height={48}
                        className={styles.flowerIcon}
                      />
                      <p>Add New Task</p>
                    </div>
                  )}
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
