import { DataTypes } from "sequelize";
import db from '../config/db.js'

const propiedad = db.define('propiedades',{
    id :{
        type: DataTypes.UUID,
        defaultValues: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    habitacion:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    wc:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    calle:{
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    lat:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    lng:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    imagen:{
        type: DataTypes.STRING,
        allowNull: false
    },
    pubicado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValues: false
    }
});

export default propiedad;