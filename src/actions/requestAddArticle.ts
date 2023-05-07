import {App, Action, Payload} from 'package-app';
import {ArticleActionName, RequestAddArticlePayload, RequestAddArticleResult, Role} from "package-types";
import Article from "../models/article";
import {ArticleService} from "../services/article";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";

export default new class RequestAddArticle implements Action{
    getName(): string{
        return ArticleActionName.RequestAddArticle;
    }

    getValidationSchema(): any {
        return {
            title: {
                type: 'string',
                max: 200
            },
            text: {
                type: 'string'
            },
            currentUser: {
                type: 'object',
                props: CurrentUserSchema
            }
        };
    }

    async execute(payload: Payload<RequestAddArticlePayload>): Promise<RequestAddArticleResult | undefined> {
        const { title, text, currentUser } = payload.params;
        try {
            const article = await ArticleService.createArticle(title, text, currentUser.id, currentUser.name);
            return { article };
        } catch (err) {
            App.logError(err);
            return ;
        }
    }
}





