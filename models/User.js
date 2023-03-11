import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';
import db from '../config/db.js'; 

const User = db.define('usuarios',{
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tocken: DataTypes.STRING,
    confirmador : DataTypes.BOOLEAN
},
{
        hooks : {
            beforeCreate : async function(usuario){
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }
});
//metodos personalizados
User.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}


export default User;