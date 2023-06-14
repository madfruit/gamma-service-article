import {Action, Payload} from 'package-app';
import {ArticleService} from "../services/article";
import {
    ArticleActionName,
    CurrentUserSchema, GetArticlesForReviewPayload, GetArticlesForReviewResult, Role,
} from "package-types";
import articleTextTrimmer from "../helpers/articleTextTrimmer";
import {addUsersArticles} from "../helpers/addUsers";
import Article from "../models/article";

export default new class GetArticlesForReview implements Action{
    getName(): string{
        return ArticleActionName.GetArticlesForReview;
    }

    getValidationSchema(): any {
        return {
            title: { type: 'string', nullable: true, optional: true },
            authorName: { type: 'string', nullable: true, optional: true },
            currentUser: { type: 'object', props: CurrentUserSchema }
        };
    }

    async execute(payload: Payload<GetArticlesForReviewPayload>): Promise<GetArticlesForReviewResult> {
        const { currentUser, title} = payload.params;
        if(!currentUser) {
            return { articles: [] };
        }
        let articlesWithoutUsers: Article[];
        if(currentUser.role === Role.AUTHOR) {
            articlesWithoutUsers = await ArticleService.getArticlesForReview(title);
        } else {
            articlesWithoutUsers = await ArticleService.getArticlesForReview(currentUser.id, title);
        }
        const trimmedArticles = articleTextTrimmer(articlesWithoutUsers);
        const articles = await addUsersArticles(trimmedArticles);
        return { articles };
    }
}





