import React, { Dispatch, SetStateAction, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  setIsBeingEdited: Dispatch<SetStateAction<null | Todo>>;
  deleteTodo: (todoId: number) => Promise<void>;
  updateTodo: (todoId: number, updatedFields: Partial<Todo>) => Promise<void>;
  setLoadingIds: Dispatch<SetStateAction<number[]>>;
};

export const TodoForm: React.FC<Props> = ({
  todo,
  setIsBeingEdited,
  deleteTodo,
  updateTodo,
  setLoadingIds,
}) => {
  const [newTitle, setNewTitle] = useState<string>(todo.title);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmit = (
    event: React.FormEvent,
    todoId: number,
    field: Partial<Todo>,
  ) => {
    event.preventDefault();

    if (todo.title === field.title) {
      setIsBeingEdited(null);

      return;
    }

    setLoadingIds(prevIds => [...prevIds, todoId]);
    if (!field.title) {
      deleteTodo(todoId)
        .finally(() => setLoadingIds([]))
        .then(() => {
          setIsBeingEdited(null);
        });

      return;
    }

    updateTodo(todoId, field).finally(() => setLoadingIds([]));
  };

  const onPressEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsBeingEdited(null);
    }
  };

  return (
    <form
      onSubmit={event =>
        handleSubmit(event, todo.id, { title: newTitle.trim() })
      }
      onBlur={event => handleSubmit(event, todo.id, { title: newTitle.trim() })}
      autoFocus
    >
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={onTitleChange}
        onKeyUp={onPressEscape}
      />
    </form>
  );
};
