import Article from "../models/article";
import {App} from "package-app";
import {GetUsersPayload, GetUsersResult, ServiceName, UsersActionName, ArticleWithUsers } from "package-types";

export default async function addUsers(articles: Article[]): Promise<ArticleWithUsers[]> {
    const userIds: string[] = [];
    articles.forEach((article) => {
        if(!userIds.includes(article.authorId)) {
            userIds.push(article.authorId);
        }
        if(!userIds.includes(article.reviewerId)) {
            userIds.push(article.reviewerId);
        }
    });

    const { users } = await App.call<GetUsersPayload, GetUsersResult>(ServiceName.Users, UsersActionName.GetUsers, {userIds});
    return articles.map((article: ArticleWithUsers) => {
        article.author = users.find(u => u.id === article.authorId);
        article.reviewer = users.find(u => u.id === article.reviewerId);
        return article;
    });
}
