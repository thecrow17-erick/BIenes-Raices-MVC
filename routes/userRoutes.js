import  express from "express";
import {autenticar, comprobarToken, confirmar, confirmarPassword, formLogin, formOlvidePassword, formRegistro, registrar, resetPassword,} from '../controllers/userController.js';

const router = express.Router();    

router.get('/login',formLogin);
router.post('/login',autenticar)

router.get('/registro',formRegistro)
router.post('/registro',registrar)

router.get('/confirmar/:token',confirmar)


router.get('/olvide-password',formOlvidePassword)
router.post('/olvide-password',resetPassword)

//almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', confirmarPassword);

export default router;
