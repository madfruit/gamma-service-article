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
            page: [
                {type: 'number', optional: true, nullable: true},
                {type: 'string', optional: true, nullable: true},
            ],
            currentUser: { type: 'object', props: CurrentUserSchema }
        };
    }

    async execute(payload: Payload<GetArticlesForReviewPayload>): Promise<GetArticlesForReviewResult> {
        const { currentUser, page, title} = payload.params;
        if(!currentUser) {
            return { articles: [] };
        }
        let articlesWithoutUsers: Article[];
        if(currentUser.role === Role.AUTHOR) {
            articlesWithoutUsers = await ArticleService.getArticlesForReview(page, title);
        } else {
            articlesWithoutUsers = await ArticleService.getArticlesForReview(page, title, currentUser.id);
        }
        const trimmedArticles = articleTextTrimmer(articlesWithoutUsers);
        const articles = await addUsersArticles(trimmedArticles);
        return { articles };
    }
}





