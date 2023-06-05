import {uuid} from "uuidv4";
import Remark from "../models/remark";

export class RemarkService {
    public static async createRemark(articleId: string, text: string): Promise<void> {
        await Remark.create({ id: uuid(), articleId: articleId, text });
    }

    public static async createRemarks(articleId: string, texts: string[]): Promise<void> {
        const remarks = texts.map(text => {
            return { id: uuid(), articleId: articleId, text };
        });
        await Remark.bulkCreate(remarks);
    }
}
