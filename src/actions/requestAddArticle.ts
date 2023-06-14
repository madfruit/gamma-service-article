import {Action, App, Payload} from 'package-app';
import {
    ArticleActionName,
    FilesActionName,
    RequestAddArticlePayload,
    RequestAddArticleResult,
    ServiceName, UploadFilesPayload, UploadFilesResult
} from "package-types";
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
            tags: {
                type: 'array',
                items: {
                    type: 'string',
                    max: 50
                }
            },
            currentUser: {
                type: 'object',
                props: CurrentUserSchema
            },
            image: {
                type: 'object'
            }
        };
    }

    async execute(payload: Payload<RequestAddArticlePayload>): Promise<RequestAddArticleResult | undefined> {
        const { title, text, tags, currentUser, image} = payload.params;
        try {
            const { fileKeys } = await App.call<UploadFilesPayload, UploadFilesResult>(ServiceName.Files, FilesActionName.UploadFiles, {files: {articleImage: image}});
            const {articleImage} = fileKeys;
            if(!articleImage) {
                throw new Error(`Unable to upload file ${image}`);
            }
            const article = await ArticleService.createArticle(title, text, currentUser.id, articleImage, tags);
            return { article };
        } catch (err) {
            App.logError(err);
            return ;
        }
    }
}





