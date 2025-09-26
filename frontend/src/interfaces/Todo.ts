

export interface Todo {
  _id: string;
  text: string;
  user:{ username:string,email?:string};
  status:"todo" | "in-progress" | "done";
}
export interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  updateTodo: (id: string, text: string) => void;
  deleteTodo: (id: string) => void;
  loading: boolean;
}