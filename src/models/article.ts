import {Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize';
import {App} from "package-app";

const sequelize = App.getInstance().getDBConnection();

class Article extends Model<InferAttributes<Article>, InferCreationAttributes<Article>> {
    declare id: string;
    declare title: string;
    declare text: string;
    declare author: string;
    declare authorName: string;
    declare posted: boolean;
    declare reviewerName: CreationOptional<string>;
    declare reviewer: CreationOptional<string>;
    declare firstPublishedAt: CreationOptional<Date>;
}

    Article.init({
    id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.CHAR(200)
    },
    text: {
        type: DataTypes.TEXT
    },
    author: {
        type: DataTypes.UUIDV4
    },
    authorName: {
        type: DataTypes.CHAR(150)
    },
    posted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    reviewerName: {
        type: DataTypes.CHAR(150),
        allowNull: true
    },
    reviewer: {
        type: DataTypes.UUIDV4,
        allowNull: true
    },
    firstPublishedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, { sequelize, modelName: 'article' });

export default Article;
