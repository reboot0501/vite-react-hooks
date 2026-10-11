// src/shared/ui/error-alert/error-alert.tsx

import { useEffect, useId, useRef } from 'react';
import type { SyntheticEvent } from 'react';
import { useAtom } from 'jotai';
import { errorAtom } from '@/shared/model';
import { Button } from '../button';
import styles from './error-alert.module.css';

/**
 * 전역 에러 알림 팝업
 *
 * - errorAtom 값이 있으면 모달을 열고, null 이면 닫는다.
 * - 확인 버튼 / ESC 키: onConfirm 실행 후 errorAtom 을 null 로 초기화
 * - 앱 최상단(App.tsx)에 한 번만 배치한다.
 *
 * 네이티브 <dialog>.showModal() 을 사용하므로 포커스 트랩, ESC 처리, 배경(backdrop)이
 * 브라우저 기본 동작으로 제공된다.
 */
export const ErrorAlert = () => {
  const [error, setError] = useAtom(errorAtom);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const messageId = useId();

  // atom 상태와 dialog 의 열림/닫힘 동기화
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (error && !dialog.open) dialog.showModal();
    if (!error && dialog.open) dialog.close();
  }, [error]);

  const handleConfirm = () => {
    const onConfirm = error?.onConfirm;
    setError(null);
    onConfirm?.();
  };

  // ESC 키 입력 시 브라우저 기본 닫기 대신 확인과 동일하게 처리 (atom 초기화 누락 방지)
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    handleConfirm();
  };

  return (
    <dialog
      ref={dialogRef}
      id="global-error-alert"
      className={styles.dialog}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={handleCancel}
    >
      <div className={styles.header}>
        <span className={styles.icon} aria-hidden="true">!</span>
        <h2 id={titleId} className={styles.title}>오류가 발생했습니다</h2>
      </div>

      <p id={messageId} className={styles.message}>
        {error?.message}
      </p>

      {(error?.errorCode || error?.errorType) && (
        <p className={styles.code}>
          {[error.errorType, error.errorCode].filter(Boolean).join(' · ')}
        </p>
      )}

      <div className={styles.actions}>
        <Button id="global-error-alert-confirm" onClick={handleConfirm} autoFocus>
          확인
        </Button>
      </div>
    </dialog>
  );
};
