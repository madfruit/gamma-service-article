import Article from "../models/article";
import Comment from "../models/comment";
import {App} from "package-app";
import {
    GetUsersPayload,
    GetUsersResult,
    ServiceName,
    UsersActionName,
    ArticleWithUsers,
    CommentWithUser
} from "package-types";

export async function addUsersArticles(articles: Article[]): Promise<ArticleWithUsers[]> {
    const userIds: string[] = [];
    articles.forEach((article) => {
        if(!userIds.includes(article.authorId)) {
            userIds.push(article.authorId);
        }
        if(!userIds.includes(article.reviewerId)) {
            userIds.push(article.reviewerId);
        }
        if(article.comments) {
            article.comments.forEach((comment) => {
                userIds.push(comment.authorId);
            });
        }
    });

    const { users } = await App.call<GetUsersPayload, GetUsersResult>(ServiceName.Users, UsersActionName.GetUsers, {userIds});
    return articles.map((article: ArticleWithUsers) => {
        article.author = users.find(u => u.id === article.authorId);
        article.reviewer = users.find(u => u.id === article.reviewerId);
        if(article.comments) {
            article.comments.map((comment) => {
                comment.author = users.find(u => u.id === comment.authorId);
                return comment;
            })
        }
        return article;
    });
}

export async function addUsersComments(comments: Comment[]): Promise<CommentWithUser[]> {
    const userIds: string[] = [];
    comments.forEach((comment) => {
        if(!userIds.includes(comment.authorId)) {
            userIds.push(comment.authorId);
        }
    });

    const { users } = await App.call<GetUsersPayload, GetUsersResult>(ServiceName.Users, UsersActionName.GetUsers, {userIds});
    return comments.map((comment: CommentWithUser) => {
        comment.author = users.find(u => u.id === comment.authorId);
        return comment;
    });
}
