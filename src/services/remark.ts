
import {uuid} from "uuidv4";
import Article from "../models/article";
import Remark from "../models/remark";

export class RemarkService {
    public static async createRemark(articleId: string, text: string): Promise<void> {
        await Remark.create({ id: uuid(), article: articleId, text });
    }

    public static async createRemarks(articleId: string, texts: string[]) {
        const remarks = texts.map(text => {
            return { id: uuid(), article: articleId, text };
        });
        await Remark.bulkCreate(remarks);
    }
}
