export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  createdAt: string
  updatedAt: string
  published: boolean
}

export interface CreatePostData {
  title: string
  content: string
  slug?: string
}

export interface UpdatePostData extends CreatePostData {
  id: string
}
