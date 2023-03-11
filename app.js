import express from "express";
import csurf from "csurf"
import cookieParser from "cookie-parser"
import userRoutes from './routes/userRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import db from './config/db.js'

//crear app
const app = express();

//Conectando a la base de datos
try{
    await db.authenticate(); 
    db.sync();
    console.log('coneccion correcta a la base de datos')
}catch(error){
    console.log(error)
}
//habilitamos lectura de formularios
app.use(express.urlencoded({extended: true}))

//habilitar cookie parser
app.use(cookieParser())

//habilitar csrf
app.use(csurf({cookie : true}))

//habilitar pugs
app.set('view engine', 'pug');
app.set('views','./views');

//carpeta publica 
app.use(express.static('public'));

//Routing
app.use('/auth',userRoutes);
app.use('/',propiedadesRoutes)


//definir el servidor
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("El servidor esta funcionando")
});
