import { Action, Payload } from 'package-app';
import {ArticleActionName, GetArticlePayload, GetArticleResult, RequestAddArticlePayload, Role} from "package-types";
import {ArticleService} from "../services/article";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";
import addUsers from "../helpers/addUsers";

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
        if(currentUser && currentUser.role === Role.AUTHOR) {
            const article = await ArticleService.getArticle(id);
            return { article };
        }
        const article = await ArticleService.getPostedArticle(id);
        const [articleWithUsers] = await addUsers([article]);
        return { article: articleWithUsers }
    }
}





