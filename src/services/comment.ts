import { Article as ArticleType } from '../interfaces/article'
import Comment from "../models/comment";

export class CommentService {
    public static async createComment(articleId: string, text: string, author: string, authorName: string, authorAvatar?: string):Promise<void> {
        await Comment.create({article: articleId, text, author, authorName, authorAvatar});
    }
}
