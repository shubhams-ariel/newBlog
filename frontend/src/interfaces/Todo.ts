

export interface Todo {
  _id: string;
  text: string;
  user:{ username:string,email?:string};
}
