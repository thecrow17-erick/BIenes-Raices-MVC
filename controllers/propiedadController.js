import precio from "../models/precio.js"
import categoria from "../models/categoria.js"


const admin = (req,res)=>{
    res.render('propiedades/admin',{
        pagina: 'Mis propiedades', 
        barra: true
    })
}
//formulario para crear una nueva propiedad
const crear = async(req,res)=>{
    //consultar modelo de precio y categoria
    const [precios,categorias] = await Promise.all([
        precio.findAll(),
        categoria.findAll()
    ])
    res.render('propiedades/crear',{
        pagina: 'Crear Propiedad', 
        barra: true,
        categorias,
        precios
    })

}
export {
    admin,
    crear
}