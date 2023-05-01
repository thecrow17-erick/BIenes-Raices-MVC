import {argv,exit} from "node:process"
import categorias from "./categorias.js";
import precios from "./precios.js";
import {precio,categoria} from "../models/index.js"
import db from "../config/db.js";

const importarDatos = async () =>{
    try {
        //autenticar    
        await db.authenticate();
        //generar columnas
        await db.sync();
        //insertemos los datos
        
        //await categoria.bulkCreate(categorias);
        //await precio.bulkCreate(precios);
        
        await Promise.all([
            categoria.bulkCreate(categorias),
            precio.bulkCreate(precios)
        ])
        console.log('Datos importados correctamente')
        exit();
    } catch (error) {
        console.log(error)
        exit(1);
    }
}

const eliminarDatos = async() =>{
    try {
        // await Promise.all([
        //     categoria.destroy({where: {}, truncate: true}),
        //     precio.destroy({where:{}, truncate:true})      //lo mismo
        // ])
        await db.sync({force: true});  //lo mismo de arriba
        console.log('datos eliminados correctamente');
        exit();
    } catch (error) {
        console.log(error)
        exit(1);
    }
}

if(argv[2] === "-i"){
    importarDatos();
}

if(argv[2] === '-e'){
    eliminarDatos();
}