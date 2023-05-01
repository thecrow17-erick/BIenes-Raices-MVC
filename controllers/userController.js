import {check,validationResult} from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../models/User.js'
import {generarId, generarJwt} from '../helpers/tockens.js'
import {emailRegistro,olvidePassword} from '../helpers/emails.js'
import { request, response } from 'express';

const formLogin =(req,res)=>{
    res.render('auth/login',{
        pagina: 'Iniciar Sesion',
        csrfToken: req.csrfToken()
    });
}
const autenticar = async(req = request,res = response)=>{
    await check('email').isEmail().withMessage('El email es obligatorio').run(req);
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req);

    let resultado = validationResult(req);
    
    if(!resultado.isEmpty()){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        });
    }
    //comprobar si el usuario existe
    const {email,password} =req.body;
    const user = await User.findOne({where: {email}})
    if(!user || !user.confirmador){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: "El usuario no existe"}],
        });
    }
    //revisar el password
    if(!user.verificarPassword(password)){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: "El password es incorrecto"}],
        });
    }
    //autenticar usuario
    const token = generarJwt(user.id); //se puede agregar mas informacion al jwt para darle mas informacion, tanto no sea informacion sensible

    return res.cookie('_token',token,{
        httpOnly: true,
        //secure: true
    }).redirect('/mis-propiedades')
}

const formRegistro =(req,res)=>{
    res.render('auth/registro',{
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    });
}

const registrar = async(req,res)=>{
    //validacion
    await check('nombre').notEmpty().withMessage('Llene el espacio del nombre.').run(req);
    await check('email').isEmail().withMessage('Eso no parece un email.').run(req);
    await check('password').isLength({min: 6}).withMessage('El password debe ser de al menos 6 caracteres.').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Los password no son iguales.').run(req);

    let resultado = validationResult(req);

    const {nombre,email,password}=req.body;
    //verficiar que resultado este vacio
    if(!resultado.isEmpty()){
        //errores
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores : resultado.array(),
            usuario: {
                nombre,
                email,
            }           
        })
    }
    
    const existeUser= await User.findOne({where : {email }});
    if(existeUser){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores : [{msg: "El usuario ya esta registrado."}],
            usuario: {
                nombre,
                email,
            }           
        })
    }
    
    //almacenar un usuarios
    const usuario = await User.create({
        nombre,
        email,
        password,
        tocken: generarId()   
    })
    //envia email de confirmacion
    emailRegistro({
        nombre : usuario.nombre,
        email : usuario.email,
        tocken: usuario.tocken
    })
    //mostrar mesanje de confirmacion 
    res.render('templates/mensaje',{
        pagina : 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un email de confirmacion, presiona en el enlace.'
    })

}
    
const confirmar =async(req,res)=>{
    const {token} = req.params;
    //verificar si el token es valido
    const usuario = await User.findOne({where : {tocken : token} })
    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Error al confirmar tu cuenta.',
            mensaje: 'Hubo un error al confirmar tu cuenta',
            error : true 
        })
    }
    //confirmar cuenta
    usuario.tocken = null;
    usuario.confirmador = true;
    await usuario.save();
    res.render('auth/confirmar-cuenta',{
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta se confirmo correctamente',
        error : false 
    })
}

const formOlvidePassword =(req,res)=>{
    res.render('auth/olvide-password',{
        pagina: 'Recupere tu acceso a Bienes Raices',
        csrfToken: req.csrfToken()
    });
}

const resetPassword = async(req,res)=>{
    await check('email').isEmail().withMessage('Eso no parece un email.').run(req);
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return res.render('auth/olvide-password',{
            pagina: 'Recupere tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores : resultado.array(),
        })
    }
    const {email} = req.body;
    const Usuario = await User.findOne({where: {email}});
    if(!Usuario){
        return res.render('auth/olvide-password',{
            pagina: 'Recupere tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores : [{msg : "El Usuario no existe"}],
            email
        })
    }
    //generar un token y enviar al email
    Usuario.tocken = generarId();
    await Usuario.save();
    //enviar un email
    olvidePassword({
        nombre: Usuario.nombre,
        email,
        tocken: Usuario.tocken      
    });
    //renderizar un mensaje
    console.log("todo bien")
    res.render('templates/mensaje',{
        pagina : 'Reestablece tu password.',
        csrfToken: req.csrfToken(),
        mensaje: 'Hemos enviado un email con las instrucciones.'
    })
}

const comprobarToken = async(req,res)=>{
    const {token} = req.params;
    const user = await User.findOne({where : {tocken : token}});
    if(!user){
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Reestablece tu password',
            csrfToken: req.csrfToken(),
            mensaje: 'Hubo un error al validar tu informacion, intenta de nuevo.',
            error : true
        })
    }
    //mostrar formulario para modificar el password
    res.render('auth/reset-password',{
        csrfToken: req.csrfToken(),
        pagina : 'Reestablece tu password',
        
    })
}

const confirmarPassword = async(req, res)=>{
    //validar el password
    await check('password').isLength({min: 6}).withMessage('El password debe ser de al menos 6 caracteres.').run(req);
    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        return res.render('auth/reset-password',{
            pagina: 'Reestablece tu password',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const {token} = req.params
    const {password} = req.body
    //identificar quien hizo el cambio
    const usuario = await User.findOne({where : {tocken: token}})
    //hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.tocken = null;
    await usuario.save();
    res.render('auth/confirmar-cuenta',{
        pagina: 'Password Reestablecido.',
        mensaje: 'El password se guardo correctamente'
    })
}    




export {
    formLogin,
    formRegistro,
    formOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    confirmarPassword,
    autenticar
}