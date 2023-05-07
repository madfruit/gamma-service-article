import {DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model} from 'sequelize';
import {App} from "package-app";

const sequelize = App.getInstance().getDBConnection();

export class Remark extends Model<InferAttributes<Remark>, InferCreationAttributes<Remark>>{
    declare id: string;
    declare article: ForeignKey<Remark['id']>;
    declare text: string;
}
Remark.init({
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
    text: {
        type: DataTypes.CHAR(500)
    }
}, {sequelize, modelName: 'remark'});

export default Remark;
