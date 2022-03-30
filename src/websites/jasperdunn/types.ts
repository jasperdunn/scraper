import { Metadata } from '../types'

export type JasperDunnData = {
  posts: Post[]
  metadata: Metadata
}

export type Post = {
  title: string
  url: string
}
