// src/shared/api/http-client.ts
import { axiosInstance } from "./axios-instance";

export async function get<T>(
  url: string,
  params?: Record<string, unknown> // key : string, value : 어떤 타입이든 가능
): Promise<T> {
  const res = await axiosInstance.get<T>(url, { params });
  return res.data;
}

export async function post<T, B>(
  url: string,
  data: B
): Promise<T> {
  const res = await axiosInstance.post<T>(url, data);
  return res.data;
}

// 리소스 전체를 교체  (보내지 않은 필드는 null/기본값으로 덮어씌워짐)
export async function put<T, B>(
  url: string,
  data: B
): Promise<T> {
  const res = await axiosInstance.put<T>(url, data);
  return res.data;
}

export async function del<T>(url: string): Promise<T> {
  const res = await axiosInstance.delete<T>(url);
  return res.data;
}
/**
 * patch<T, B>
 * ─ 역할 ───────────────────────────────────────────────────────────────────────
 * HTTP PATCH 요청을 보내는 공통 래퍼 함수.
 * 리소스의 일부 필드만 수정할 때 사용한다.
 * axiosInstance를 통해 요청하고, 응답 본문(res.data)만 꺼내서 반환한다.
 *
 * ─ PUT 과의 차이 ───────────────────────────────────────────────────────────────
 *   PUT  → 리소스 전체를 교체  (보내지 않은 필드는 null/기본값으로 덮어씌워짐)
 *   PATCH → 리소스의 일부만 수정 (보낸 필드만 변경, 나머지 필드는 유지)
 *
 * ─ 사용 시점 ───────────────────────────────────────────────────────────────────
 * 이름, 상태 등 특정 필드 하나~일부만 변경하는 수정(Modify) API를 호출할 때.
 * ex) 프로젝트 이름 변경, 사용자 역할 변경, 담당자 목록 수정 등
 *
 * ─ 사용 예시 ───────────────────────────────────────────────────────────────────
 * // src/entities/project/api/modify-project.api.ts
 * import { patch } from "@/shared/api";
 * import type { Project } from "../model/project.entity";
 *
 * export function modifyProject(id: string, data: Partial<Project>) {
 *     // Project 엔터티의 일부(Partial)만 수정할 때 이 patch 함수를 호출함
 *     // PATCH /projects/:id  →  변경된 필드만 전송
 *     return patch<Project, Partial<Project>>(`/projects/${id}`, data);
 * }
 *
 * // src/entities/nexcope-user/api/update-user.api.ts
 * import { patch } from "@/shared/api";
 * import type { NexcopeUser } from "../model/nexcope-user.entity";
 *
 * export function updateUser(id: string, data: Partial<NexcopeUser>) {
 *     // PATCH /users/:id  →  role, name 등 일부 필드만 수정
 *     return patch<NexcopeUser, Partial<NexcopeUser>>(`/users/${id}`, data);
 * }
 *
 * ─ 제네릭 파라미터 ─────────────────────────────────────────────────────────────
 * @template T - 서버 응답으로 받을 데이터 타입 (ex. Project, NexcopeUser)
 * @template B - 요청 body의 타입 (ex. Partial<Project>)
 * @param url  - 요청 URL (ex. "/projects/abc-123")
 * @param data - 수정할 필드만 담은 객체
 * @returns    서버에서 반환한 수정 결과 데이터 (T 타입)
 */
export async function patch<T, B>(
    url: string,
    data: B
): Promise<T> {
    const res = await axiosInstance.patch<T>(url, data);
    return res.data;
}
