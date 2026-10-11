// src/shared/ui/input/input.tsx

import type { InputHTMLAttributes } from 'react';
import styles from './input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className = '', ...props }: InputProps) => {
  const inputClass = `${styles.input} ${className}`.trim();

  return <input className={inputClass} {...props} />;
};
