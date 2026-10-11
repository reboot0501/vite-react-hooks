// src/shared/ui/pagination/floating-pagination.tsx

import { useState } from 'react';
import { usePagination, DOTS } from './use-pagination';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from '../icon';
import styles from './floating-pagination.module.css';

export type PaginationDockPosition = 'bottom' | 'top' | 'left' | 'right';

export interface FloatingPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  position?: PaginationDockPosition;
  defaultPosition?: PaginationDockPosition;
  onPositionChange?: (position: PaginationDockPosition) => void;
  onScrollTop?: () => void;
  onScrollBottom?: () => void;
  onPrevItem?: () => void;
  onNextItem?: () => void;
  siblingCount?: number;
  className?: string;
}

export function FloatingPagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50, 100],
  position: controlledPosition,
  defaultPosition = 'bottom',
  onPositionChange,
  onScrollTop,
  onScrollBottom,
  siblingCount = 1,
  className = '',
}: FloatingPaginationProps) {
  // 내부 도킹 위치 상태 ('bottom' | 'top' | 'left' | 'right')
  const [internalPosition, setInternalPosition] = useState<PaginationDockPosition>(defaultPosition);
  const currentPosition = controlledPosition ?? internalPosition;

  const isVertical = currentPosition === 'left' || currentPosition === 'right';

  const paginationRange = usePagination({
    currentPage,
    totalPages,
    siblingCount: isVertical ? 0 : siblingCount, // 세로형일 때는 컴팩트하게 표시
  });

  const handlePositionChange = (pos: PaginationDockPosition) => {
    if (onPositionChange) {
      onPositionChange(pos);
    } else {
      setInternalPosition(pos);
    }

    if (pos === 'top') {
      onScrollTop?.();
    } else if (pos === 'bottom') {
      onScrollBottom?.();
    }
  };

  // 위치에 따른 고정 스타일 클래스 매핑
  const positionClasses: Record<PaginationDockPosition, string> = {
    bottom: styles.bottom,
    top: styles.top,
    left: styles.left,
    right: styles.right,
  };

  return (
    <div
      className={[styles.wrapper, positionClasses[currentPosition], className]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          styles.dockBar,
          isVertical ? styles.dockBarVertical : styles.dockBarHorizontal,
        ].join(' ')}
      >
        {/* 1. 4방향 위치 이동 컨트롤러 (↑, ↓, ←, →) */}
        <div
          className={[
            styles.directionControls,
            isVertical ? styles.directionControlsVertical : styles.directionControlsHorizontal,
          ].join(' ')}
        >
          <button
            type="button"
            className={[
              styles.iconBtn,
              currentPosition === 'top' && styles.iconBtnActive,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handlePositionChange('top')}
            title="상단으로 이동 (↑)"
            aria-label="상단으로 이동"
          >
            <ArrowUp className={styles.icon} />
          </button>

          <button
            type="button"
            className={[
              styles.iconBtn,
              currentPosition === 'bottom' && styles.iconBtnActive,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handlePositionChange('bottom')}
            title="하단으로 이동 (↓)"
            aria-label="하단으로 이동"
          >
            <ArrowDown className={styles.icon} />
          </button>

          <button
            type="button"
            className={[
              styles.iconBtn,
              currentPosition === 'left' && styles.iconBtnActive,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handlePositionChange('left')}
            title="좌측으로 이동 (←)"
            aria-label="좌측으로 이동"
          >
            <ArrowLeft className={styles.icon} />
          </button>

          <button
            type="button"
            className={[
              styles.iconBtn,
              currentPosition === 'right' && styles.iconBtnActive,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handlePositionChange('right')}
            title="우측으로 이동 (→)"
            aria-label="우측으로 이동"
          >
            <ArrowRight className={styles.icon} />
          </button>
        </div>

        {/* 구분선 */}
        <div
          className={[
            styles.divider,
            isVertical ? styles.dividerVertical : styles.dividerHorizontal,
          ].join(' ')}
        />

        {/* 2. 페이지당 표시 row 수 Select Box (3자리 숫자 지원) */}
        <div className={styles.selectWrapper}>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            aria-label="페이지당 행 개수 선택"
            className={[
              styles.pageSizeSelect,
              isVertical ? styles.pageSizeSelectVertical : styles.pageSizeSelectHorizontal,
            ].join(' ')}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* 구분선 */}
        <div
          className={[
            styles.divider,
            isVertical ? styles.dividerVertical : styles.dividerHorizontal,
          ].join(' ')}
        />

        {/* 3. 첫 페이지 («) & 이전 페이지 (‹) */}
        <div
          className={
            isVertical ? styles.buttonGroupVertical : styles.buttonGroupHorizontal
          }
        >
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            title="첫 페이지"
            aria-label="첫 페이지"
          >
            <ChevronsLeft className={styles.icon} />
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            title="이전 페이지"
            aria-label="이전 페이지"
          >
            <ChevronLeft className={styles.icon} />
          </button>
        </div>

        {/* 4. 페이지 번호 목록 */}
        <div
          className={
            isVertical ? styles.pageListVertical : styles.pageListHorizontal
          }
        >
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <div key={`dots-${index}`} className={styles.dots}>
                  <MoreHorizontal className={styles.icon} />
                </div>
              );
            }

            const isCurrent = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                type="button"
                className={[
                  styles.pageBtn,
                  isCurrent && styles.pageBtnActive,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onPageChange(Number(pageNumber))}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* 5. 다음 페이지 (›) & 마지막 페이지 (») */}
        <div
          className={
            isVertical ? styles.buttonGroupVertical : styles.buttonGroupHorizontal
          }
        >
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            title="다음 페이지"
            aria-label="다음 페이지"
          >
            <ChevronRight className={styles.icon} />
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            title="마지막 페이지"
            aria-label="마지막 페이지"
          >
            <ChevronsRight className={styles.icon} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FloatingPagination;
