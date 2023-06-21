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
            order: {type: 'string', nullable: true, optional: true},
            orderBy: {type: 'string', nullable: true, optional: true},
            currentUser: { type: 'object', optional: true, nullable: true, props: CurrentUserSchema }
        };
    }

    async execute(payload: Payload<SearchArticlesPayload>): Promise<SearchArticlesResult> {
        const {text, page, order, orderBy} = payload.params;
        const articleText = text ?? '';
        let articles;
        let orderByForQuery = orderBy ? orderBy : 'viewCount';
        let orderForQuery = order ? order : 'DESC';
        if(articleText.startsWith('%')) {
            const tags = articleText.replace('%', '').split(';').map(t => t.trim()).filter(t => t !== '');
            articles = await ArticleService.getArticlesByTags(tags, orderForQuery, orderByForQuery, page);
        } else {
            articles = await ArticleService.getArticles(articleText, orderForQuery, orderByForQuery, page);
        }
        const trimmedArticles = articleTextTrimmer(articles);
        const articlesWithUsers = await addUsersArticles(trimmedArticles);
        return { articles: articlesWithUsers };
    }
}





