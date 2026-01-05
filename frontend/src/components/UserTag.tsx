import React from "react";
import styles from "src/components/UserTag.module.css";

import type { User } from "src/api/users";

export type UserTagProps = {
  user?: User | null;
  className?: string;
};

export function UserTag({ user, className }: UserTagProps) {
  if (user == null) {
    return (
      <div className={`${styles.container} ${className ?? ""}`.trim()}>
        <img className={styles.avatar} src="/userDefault.svg" alt="" />
        <span className={styles.name}>Not assigned</span>
      </div>
    );
  }

  const profileSrc = user.profilePictureURL ?? "/userDefault.svg";

  return (
    <div className={`${styles.container} ${className ?? ""}`.trim()}>
      <img className={styles.avatar} src={profileSrc} alt="" />
      <span className={styles.name}>{user.name}</span>
    </div>
  );
}
