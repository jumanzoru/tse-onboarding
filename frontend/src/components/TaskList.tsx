import { Dialog } from "@tritonse/tse-constellation";
import React, { useEffect, useState } from "react";
import { getAllTasks, type Task } from "src/api/tasks";
import { TaskItem } from "src/components";
import styles from "src/components/TaskList.module.css";

export type TaskListProps = {
  title: string;
};

export function TaskList({ title }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const result = await getAllTasks();
      if (result.success) {
        setTasks(result.data);
      } else {
        setError(result.error);
      }
    }
    void load();
  }, []);

  return (
    <div className={styles.container}>
      <span className={styles.title}>{title}</span>

      <div className={styles.items}>
        {tasks.length === 0 ? (
          <p>No tasks yet. Add one above to get started!</p>
        ) : (
          tasks.map((task) => <TaskItem key={task._id} task={task} />)
        )}
      </div>

      <Dialog isOpen={error !== null} onClose={() => setError(null)}>
        <div className={styles.errorModalText}>{error}</div>
      </Dialog>
    </div>
  );
}
