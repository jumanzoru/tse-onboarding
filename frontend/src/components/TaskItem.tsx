import { Dialog } from "@tritonse/tse-constellation";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { updateTask } from "src/api/tasks";
import { CheckButton, UserTag } from "src/components";
import styles from "src/components/TaskItem.module.css";

import type { Task, UpdateTaskRequest } from "src/api/tasks";

export type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task: initialTask }: TaskItemProps) {
  const [task, setTask] = useState<Task>(initialTask);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleToggleCheck = async (): Promise<void> => {
    setLoading(true);

    const payload: UpdateTaskRequest = {
      _id: task._id,
      title: task.title,
      description: task.description,
      isChecked: !task.isChecked,
      dateCreated: task.dateCreated,
      // UpdateTaskRequest expects an ID string, not a User object
      assignee: task.assignee?._id,
    };

    const result = await updateTask(payload);

    if (result.success) {
      setTask(result.data);
      setError("");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const textContainerClass = task.isChecked
    ? `${styles.textContainer} ${styles.checked}`
    : styles.textContainer;

  return (
    <div className={styles.item}>
      <CheckButton
        checked={task.isChecked}
        disabled={isLoading}
        onPress={() => void handleToggleCheck()}
      />

      <div className={textContainerClass}>
        <Link to={`/task/${task._id}`} className={styles.titleLink}>
          <span className={styles.title}>{task.title}</span>
        </Link>
        {task.description && <span className={styles.description}>{task.description}</span>}
      </div>

      {/* UserTag on the right */}
      <UserTag user={task.assignee} className={styles.userTag} />

      <Dialog isOpen={error !== ""} onClose={() => setError("")}>
        <p className={styles.errorModalText}>{error}</p>
      </Dialog>
    </div>
  );
}
