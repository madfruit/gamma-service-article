import {Action, App, Payload} from 'package-app';
import {ArticleActionName, GetArticlePayload, GetArticleResult, Role} from "package-types";
import {ArticleService} from "../services/article";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";
import {addUsersArticles} from "../helpers/addUsers";
import Article from "../models/article";

export default new class GetObjectById implements Action{
    getName(): string{
        return ArticleActionName.GetArticle;
    }

    getValidationSchema(): any {
        return {
            id: { type:'string'},
            currentUser: { type: 'object', optional: true, nullable: true, props: CurrentUserSchema }
        };
    }

    async execute(payload: Payload<GetArticlePayload>): Promise<GetArticleResult> {
        const { id, currentUser } = payload.params;
        let article: Article;
        try {
            if (!currentUser) {
                article = await ArticleService.getPostedOrSelfArticle(id);
            } else {
                if (currentUser.role === Role.AUTHOR) {
                    article = await ArticleService.getArticle(id);
                } else {
                    article = await ArticleService.getPostedOrSelfArticle(id, currentUser.id);
                }
            }
            if(!article) {
                return;
            }
            const [articleWithUsers] = await addUsersArticles([article]);
            return {article: articleWithUsers}
        } catch (err) {
            App.logError(err);
        }
    }
}





