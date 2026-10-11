// src/shared/ui/button/button.tsx

import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import styles from './button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outlined' | 'danger';
}

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const variantClass = styles[variant] || '';
  const buttonClass = `${styles.button} ${variantClass} ${className}`.trim();

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};
