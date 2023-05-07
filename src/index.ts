import {App} from 'package-app';
import { config } from './env/env.js';

const app = App.getInstance();

async function main(): Promise<void> {
    await app.run({
        name: config.name,
    });
}

main().then();

