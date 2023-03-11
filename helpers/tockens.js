import jwt from 'jsonwebtoken'

function random() {
    return Math.random().toString(36).substr(2); // Eliminar `0.`
};

const generarId=()=> random() + random(); // Para hacer el token más largo

const generarJwt=(id)=> jwt.sign({id},process.env.JWT_SECRET, {expiresIn : '1d'})

export  {
    generarId,
    generarJwt
}