import type { NextApiRequest, NextApiResponse } from "next";
import type {RespostaPadaoMsg } from '../../types/RespostaPadraoMsg' ;
import { politicaCORS } from "@/middlewares/politicadeCors";


const endpointSeguir = async(req : NextApiRequest, res : NextApiResponse<RespostaPadaoMsg>) => {
    try{
        if(req.method === 'GET'){
            return res.status(200).json({msg: 'ok'});
        }
            
        return res.status(405).json({erro : 'Metodo informado nao existe'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro : 'Nao foi posivel executar esse funçao'});
    }
}

export default politicaCORS(endpointSeguir);




