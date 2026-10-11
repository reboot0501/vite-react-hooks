export const DOTS = '...';

interface UsePaginationProps {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}

export function usePagination({
  currentPage,
  totalPages,
  siblingCount = 1,
}: UsePaginationProps): (number | typeof DOTS)[] {
  // 총 표시할 아이템 수: first + last + current + 2*siblings + 2*dots = 2*siblings + 5
  const totalPageNumbers = siblingCount * 2 + 5;

  // 전체 페이지 수가 표시할 개수보다 적으면 전체 표시
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  // 1. 오른쪽 Dots만 있는 경우 (초반 페이지)
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, DOTS, totalPages];
  }

  // 2. 왼쪽 Dots만 있는 경우 (후반 페이지)
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [firstPageIndex, DOTS, ...rightRange];
  }

  // 3. 양쪽 모두 Dots가 있는 경우 (중간 페이지)
  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }

  return [];
}
