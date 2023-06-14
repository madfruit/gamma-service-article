import {Action, Payload} from 'package-app';
import {ArticleService} from "../services/article";
import {
    ArticleActionName,
    SearchArticlesPayload,
    SearchArticlesResult,
    CurrentUserSchema,
} from "package-types";
import articleTextTrimmer from "../helpers/articleTextTrimmer";
import {addUsersArticles} from "../helpers/addUsers";

export default new class SearchArticles implements Action{
    getName(): string{
        return ArticleActionName.GetArticles;
    }

    getValidationSchema(): any {
        return {
            text: { type: 'string', nullable: true, optional: true },
            currentUser: { type: 'object', optional: true, nullable: true, props: CurrentUserSchema }
        };
    }

    async execute(payload: Payload<SearchArticlesPayload>): Promise<SearchArticlesResult> {
        const text = payload.params.text ?? '';
        const articles = await ArticleService.getArticles(text);
        const trimmedArticles = articleTextTrimmer(articles);
        const articlesWithUsers = await addUsersArticles(trimmedArticles);
        return { articles: articlesWithUsers };
    }
}





