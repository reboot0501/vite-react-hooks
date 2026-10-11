// 공통 응답 규격
// src/shared/api/api-response.type.ts
export interface OffsetElementList<T> {
  results: T[]
  totalCount: number
  offset: number
  limit: number
  page: number
  size: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface ApiResponse<T> {
  data: T[]
  totalPage: number
  page: number
}

export interface ApiError {
  message: string
  status: number
}

export interface CommandResponse<T = string> {
  entityId: T;
}

export interface QueryResponse<T> {
  queryResult: T;
}