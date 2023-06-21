import Comment from "./comment";
import {
    Column,
    PrimaryKey,
    Model,
    DataType,
    Table,
    ForeignKey,
    AllowNull,
    BelongsTo
} from "sequelize-typescript";

@Table({tableName: 'reports'})
class Report extends Model<Report> {
    @PrimaryKey
    @Column({
        type: DataType.UUIDV4,
        defaultValue: DataType.UUIDV4
    })
    id: string;

    @Column(DataType.UUIDV4)
    @ForeignKey(() => Comment)
    commentId: string;

    @BelongsTo(() => Comment)
    comment: Comment

    @Column(DataType.UUIDV4)
    userId: string;

    @Column(DataType.DATE)
    createdAt: Date;

    @AllowNull
    @Column(DataType.DATE)
    updatedAt?: Date;
}

export default Report;
