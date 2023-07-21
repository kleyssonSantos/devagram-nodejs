import type { NextApiRequest, NextApiResponse } from "next";
import type {RespostaPadaoMsg } from '../../types/RespostaPadraoMsg' ;
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import { SeguidorModel } from "@/models/SeguidorModel";
import { politicaCORS } from "@/middlewares/politicadeCors";


const endpointSeguir = async(req : NextApiRequest, res : NextApiResponse<RespostaPadaoMsg>) => {
    try{
        if(req.method === 'GET'){
            return res.status(200).json({msg: 'ok'});
        }
            
        return res.status(405).json({erro : 'Metodo informado nao existe'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro : 'Nao foi possivel seguir/deseguir o usuario informado'});
    }
}

export default politicaCORS(endpointSeguir);




