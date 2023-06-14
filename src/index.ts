import {App} from 'package-app';
import { config } from './env/env.js';
import Article from "./models/article";
import Remark from "./models/remark";
import Comment from "./models/comment";
import Report from "./models/report";

const app = App.getInstance();

async function main(): Promise<void> {
    await app.run({
        name: config.name,
    });
}
app.getDBConnection().addModels([Article, Comment, Remark, Report]);
main().then();

