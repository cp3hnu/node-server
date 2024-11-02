// 用户管理
import { request } from '@umijs/max';

export function getUserListReq(params: { name: string }) {
  return request(`/api/users`, {
    method: 'GET',
    params,
  });
}

export function getUserInfoReq(id: number) {
  return request(`/api/users/${id}`, {
    method: 'GET',
  });
}

export function postUserReq(data: Omit<User, 'id'>) {
  return request(`/api/users`, {
    method: 'POST',
    data,
  });
}

export function pathUserReq(id: number, data: Omit<User, 'id'>) {
  return request(`/api/users/${id}`, {
    method: 'PATCH',
    data,
  });
}

export function deleteUserReq(id: number) {
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
}
