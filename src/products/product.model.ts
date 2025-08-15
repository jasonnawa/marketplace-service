import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
} from 'sequelize-typescript';
import { ProductCategory } from './enums/product-category.enum';

interface ProductCreationAttrs {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: ProductCategory;
    images: string[];
}

@Table({
    tableName: 'products',
    timestamps: true
})
export class Product extends Model<Product, ProductCreationAttrs> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    description: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    price: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    stock: number;

    @Column({
        type: DataType.ENUM(...Object.values(ProductCategory)),
        allowNull: false,
    })
    category: ProductCategory;

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: false,
        defaultValue: [],
    })
    images: string[];
}
