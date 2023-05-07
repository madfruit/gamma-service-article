import {CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model} from 'sequelize';
import {App} from "package-app";
import Article from "./article";

const sequelize = App.getInstance().getDBConnection();

class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
    declare id: string;
    declare article: ForeignKey<Article['id']>
    declare author: string;
    declare authorName: string;
    declare authorAvatar: CreationOptional<string>;
    declare text: string;
}
Comment.init( {
    id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    article: {
        type: DataTypes.UUIDV4,
        references: {
            model: 'articles',
            key: 'id'
        }
    },
    author: {
        type: DataTypes.UUIDV4,
    },
    authorName: {
        type: DataTypes.CHAR(150)
    },
    authorAvatar: {
        type: DataTypes.CHAR(400),
        allowNull: true
    },
    text: {
        type: DataTypes.CHAR(1000)
    }
}, { sequelize, modelName: 'comment' });

export default Comment;
