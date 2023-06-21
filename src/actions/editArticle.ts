import {Action, App, Payload} from 'package-app';
import {
    ArticleActionName,
    FilesActionName,
    RequestAddArticlePayload,
    RequestAddArticleResult,
    ServiceName, UploadFilesPayload, UploadFilesResult,
    EditArticlePayload, EditArticleResult
} from "package-types";
import {ArticleService} from "../services/article";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";
import {setImagesToArticleText} from "../helpers/setImagesToArticleText";

export default new class EditArticle implements Action {
    getName(): string {
        return ArticleActionName.EditArticle;
    }

    getValidationSchema(): any {
        return {
            articleId: {
                type: 'string',
            },
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
            image: [{
                type: 'object'
            }, {
                type: 'string'
            }]
        };
    }

    async execute(payload: Payload<EditArticlePayload>): Promise<EditArticleResult | undefined> {
        const { articleId, title, text, tags , image } = payload.params;
        try {
            let articleImage: string;
            if (typeof image === "string") {
                articleImage = image;
            } else {
                const {fileKeys} = await App.call<UploadFilesPayload, UploadFilesResult>(ServiceName.Files, FilesActionName.UploadFiles, {files: {articleImage: image}});
                 articleImage = fileKeys['articleImage'];
                if (!articleImage) {
                    throw new Error(`Unable to upload file ${image}`);
                }
            }
            const textWithImages = await setImagesToArticleText(text);
            await ArticleService.editArticle(articleId,{title, text: textWithImages, tags, image: articleImage});
            return {success: true};
        } catch (err) {
            App.logError(err);
            return {success: false};
        }
    }
}





