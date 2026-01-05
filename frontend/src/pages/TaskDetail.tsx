import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTask, type Task } from "src/api/tasks";
import styles from "src/pages/TaskDetail.module.css";

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();

  const [task, setTask] = useState<Task | null>(null);

  const [notFound, setNotFound] = useState<boolean>(false);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  useEffect(() => {
    async function fetchTask() {
      if (!id) return;

      const result = await getTask(id);

      if (result.success) {
        setTask(result.data);
        setNotFound(false);
      } else {
        setTask(null);
        setNotFound(true);
      }
    }

    void fetchTask();
  }, [id]);

  useEffect(() => {
    if (task?.title) {
      document.title = `${task.title} | TSE Todos`;
    } else {
      document.title = `Task | TSE Todos`;
    }
  }, [task?.title]);

  const statusText = task?.isChecked ? "Done" : "Not done";

  const createdText = useMemo(() => {
    if (!task) return "";
    return dateFormatter.format(task.dateCreated);
  }, [task]);

  const assigneeText = useMemo(() => {
    const assigneeId = task?.assignee?._id;
    return assigneeId ?? "Unassigned";
  }, [task?.assignee]);

  if (notFound) {
    return (
      <div className={styles.container}>
        <Link className={styles.homeLink} to="/">
          Home
        </Link>
        {/*  */}
        <p className={styles.notFound}>Task not found.</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className={styles.container}>
        <Link className={styles.homeLink} to="/">
          Home
        </Link>
        <p className={styles.loading}>Loading…</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link className={styles.homeLink} to="/">
        Home
      </Link>

      <div className={styles.headerRow}>
        <h1 className={styles.title}>{task.title}</h1>

        <button className={styles.editButton} type="button" onClick={() => {}}>
          Edit task
        </button>
      </div>

      {/* Description: conditionally render */}
      {task.description ? (
        <p className={styles.description}>{task.description}</p>
      ) : (
        <p className={styles.emptyDescription}>No description</p>
      )}

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Assignee</span>
          <span className={styles.metaValue}>{assigneeText}</span>
        </div>

        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Status</span>
          <span className={styles.metaValue}>{statusText}</span>
        </div>

        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Created</span>
          <span className={styles.metaValue}>{createdText}</span>
        </div>
      </div>
    </div>
  );
}
