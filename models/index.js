import propiedad from "./propiedad.js"
import precio from "./precio.js"
import categoria from "./categoria.js"
import user from "./User.js"

//relaciones de 1 a 1, son lo mismo
    //precio.hasOne(propiedad)
propiedad.belongsTo(precio,{foreignKey: 'precioId'})



export {
    propiedad,
    precio,
    categoria,
    user
}