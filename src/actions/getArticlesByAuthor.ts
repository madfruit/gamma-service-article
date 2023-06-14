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
            currentUser: { type: 'object', optional: true, nullable: true, props: CurrentUserSchema }
        };
    }

    async execute(payload: Payload<GetArticlesByAuthorPayload>): Promise<GetArticlesByAuthorResult> {
        const { authorId, currentUser } = payload.params;
        try {
            if (currentUser && authorId === currentUser.id) {
                const articles = await ArticleService.getMyArticles(authorId);

                return {articles: articleTextTrimmer(articles)};
            } else {
                const articles = await ArticleService.getArticlesByAuthor(authorId);
                return {articles:  articleTextTrimmer(articles)};
            }
        } catch (err) {
            App.logError(err);
            throw Error;
        }
    }
}





