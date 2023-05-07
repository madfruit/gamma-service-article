import { ServiceConfig } from 'package-app';

export const config: ServiceConfig = {
    name: 'article',
    brokerConfig: {
        nodeID: 'article',
        transporter: 'redis://localhost:6379',
        logger: true,
        logLevel: 'info'
    }
}
export default config;
