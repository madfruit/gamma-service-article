import {Action, App, Payload} from 'package-app';
import {ArticleService} from "../services/article";
import {
    ArticleActionName,
    CurrentUserSchema, GetArticlesByAuthorPayload, GetArticlesByAuthorResult,
} from "package-types";
import articleTextTrimmer from "../helpers/articleTextTrimmer";

export default new class GetArticlesByAuthor implements Action{
    getName(): string{
        return ArticleActionName.GetArticlesByAuthor;
    }

    getValidationSchema(): any {
        return {
            authorId: { type: 'string' },
            page: [
                {type: 'number', optional: true, nullable: true},
                {type: 'string', optional: true, nullable: true},
            ],
            currentUser: { type: 'object', optional: true, nullable: true, props: CurrentUserSchema }
        };
    }

    async execute(payload: Payload<GetArticlesByAuthorPayload>): Promise<GetArticlesByAuthorResult> {
        const { authorId, page, currentUser } = payload.params;
        try {
            if (currentUser && authorId === currentUser.id) {
                const articles = await ArticleService.getMyArticles(authorId, page);

                return {articles: articleTextTrimmer(articles)};
            } else {
                const articles = await ArticleService.getArticlesByAuthor(authorId, page);
                return {articles:  articleTextTrimmer(articles)};
            }
        } catch (err) {
            App.logError(err);
            throw Error;
        }
    }
}





