export type CategoryId =
  | "food"
  | "medicine"
  | "tech"
  | "moral"
  | "volunteer"
  | "consult";

export type PostType = "request" | "offer";

export interface Post {
  id: string;
  type: PostType;
  name: string;
  city: string;
  district?: string;
  category: CategoryId;
  description: string;
  createdAt: number;
  resolved?: boolean;
  ownerId: string;
}

export interface Response {
  id: string;
  postId: string;
  fromName: string;
  message: string;
  createdAt: number;
}
