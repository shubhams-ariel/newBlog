// import { createAPI } from "../utils/axiosInstance";
// import type { IBlog } from "../interfaces/Blog";


// const adminAPI = createAPI("admin");


// const authAPI = createAPI("auth");


// const blogAPI = createAPI("blogs");
// const blogAPIMethods = {
//   getAll: () => blogAPI.get<IBlog[]>("/"),

//   getById: (id: string) =>
//     blogAPI.get<IBlog>(`/${id}`, {
//       headers: { "Cache-Control": "no-cache" },
//     }),

//   create: (data: { title: string; content: string; tags?: string[]; image?: string }) =>
//     blogAPI.post<IBlog>("/", data),

//   update: (
//     id: string,
//     data: { title?: string; content?: string; tags?: string[]; image?: string }
//   ) => blogAPI.put<IBlog>(`/${id}`, data),

//   delete: (id: string) => blogAPI.delete<IBlog>(`/${id}`),

//   like: (id: string) =>
//     blogAPI.post<{ likes: number; likedByUser: boolean }>(`/${id}/like`),

//   addComment: (id: string, text: string) =>
//     blogAPI.post<{ comments: any[] }>(`/${id}/comments`, { text }),

//   deleteComment: (blogId: string, commentId: string) =>
//     blogAPI.delete(`/${blogId}/comments/${commentId}`),
// };


// const todoAPI = createAPI("todos");


// export const api = {
//   admin: adminAPI,
//   auth: authAPI,
//   blog: blogAPIMethods,
//   todo: todoAPI,
// };