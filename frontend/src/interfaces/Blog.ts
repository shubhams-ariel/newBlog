
export interface IBlog {
  _id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}
