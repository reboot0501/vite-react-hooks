// src/shared/ui/divider/divider.tsx

import type { HTMLAttributes } from 'react';
import styles from './divider.module.css';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {}

export const Divider = ({ className = '', ...props }: DividerProps) => {
  const dividerClass = `${styles.divider} ${className}`.trim();

  return <hr className={dividerClass} {...props} />;
};
