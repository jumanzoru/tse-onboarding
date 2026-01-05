import { Dialog } from "@tritonse/tse-constellation";
import { useState } from "react";
import { createTask, updateTask } from "src/api/tasks";
import { Button, TextField } from "src/components";
import styles from "src/components/TaskForm.module.css";

import type { Task, UpdateTaskRequest } from "src/api/tasks";

export type TaskFormProps = {
  mode: "create" | "edit";
  task?: Task;
  onSubmit?: (task: Task) => void;
};

/**
 * A simple way to handle error states in the form. We'll keep a
 * `TaskFormErrors` object in the form's state, initially empty. Before we
 * submit a request, we'll check each field for problems. For each invalid
 * field, we set the corresponding field in the errors object to true, and the
 * corresponding input component will show its error state if the field is true.
 * Look at where the `errors` object appears below for demonstration.
 *
 * In the MVP, the only possible error in this form is that the title is blank,
 * so this is slightly overengineered. However, a more complex form would need
 * a similar system.
 */
type TaskFormErrors = {
  title?: boolean;
};

/**
 * The form that creates or edits a Task object. In the MVP, this is only
 * capable of creating Tasks.
 *
 * @param props.mode Controls how the form renders and submits
 * @param props.task Optional initial data to populate the form with (such as
 * when we're editing an existing task)
 * @param props.onSubmit Optional callback to run after the user submits the
 * form and the request succeeds
 */
export function TaskForm({ mode, task, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState<string>(task?.title || "");
  const [description, setDescription] = useState<string>(task?.description || "");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [assignee, setAssignee] = useState<string>(task?.assignee?._id ?? "");

  // This state variable controls the error message that gets displayed to the user in the
  // Constellation `Dialog` component. If it's `null`, there's no error, so we don't display the Dialog.
  // If it's non-null, there is an error, so we should display that error to the user.
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    setErrors({});
    if (title.length === 0) {
      setErrors({ title: true });
      return;
    }

    setLoading(true);

    const trimmedAssignee = assignee.trim();

    const request =
      mode === "create"
        ? createTask({
            title,
            description,
            assignee: trimmedAssignee === "" ? undefined : trimmedAssignee,
          })
        : updateTask({
            _id: task?._id ?? "",
            title,
            description,
            isChecked: task?.isChecked ?? false,
            dateCreated: task?.dateCreated ?? new Date(),
            assignee: trimmedAssignee, // guide wants "" allowed
          } satisfies UpdateTaskRequest);

    request
      .then((result) => {
        if (result.success) {
          if (mode === "create") {
            setTitle("");
            setDescription("");
            setAssignee("");
          }

          if (onSubmit) onSubmit(result.data);
        } else {
          setErrorModalMessage(result.error);
        }

        setLoading(false);
      })
      .catch((error) => {
        setErrorModalMessage(error instanceof Error ? error.message : String(error));
        setLoading(false);
      });
  };

  const formTitle = mode === "create" ? "New task" : "Edit task";

  return (
    <form className={styles.form}>
      {/* we could just use a `<div>` element because we don't need the special
      functionality that browsers give to `<form>` elements, but using `<form>`
      is better for accessibility because it's more accurate for this purpose--
      we are making a form, so we should use `<form>` */}
      <span className={styles.formTitle}>{formTitle}</span>
      <div className={styles.formRow}>
        <TextField
          className={styles.textField}
          data-testid="task-title-input"
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
        />
        <TextField
          className={`${styles.textField} ${styles.stretch}`}
          data-testid="task-description-input"
          label="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className={styles.assigneeRow}>
        <TextField
          className={`${styles.textField} ${styles.stretch}`}
          data-testid="task-assignee-input"
          label="Assignee ID (optional)"
          value={assignee}
          onChange={(event) => setAssignee(event.target.value)}
        />
        <Button
          kind="primary"
          data-testid="task-save-button"
          label="Save"
          disabled={isLoading}
          onClick={handleSubmit}
        />
      </div>
      {/* Use the Constellation Dialog component to display an error message if there's an error 
      See the docs (https://tritonse.github.io/TSE-Constellation/?path=/docs/organisms-dialog--documentation)
      for a demo and more info on the prop types  */}
      <Dialog
        styleVersion="styled"
        variant="error"
        title="An error occurred"
        // Override the text color so it doesn't show white text on a white background
        content={<p className={styles.errorModalText}>{errorModalMessage}</p>}
        isOpen={errorModalMessage !== null}
        onClose={() => setErrorModalMessage(null)}
      />
    </form>
  );
}
