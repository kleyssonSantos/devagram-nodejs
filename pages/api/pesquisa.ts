import { NextApiRequest, NextApiResponse } from "next";
import {RespostaPadaoMsg} from '../../types/RespostaPadraoMsg';
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";

const pesquisaEndpoint = async (req : NextApiRequest, res : NextApiResponse <RespostaPadaoMsg | any[]>) => {

    try{
        if(req.method === 'GET'){
            if(req?.query?.id){
                const usuariosEncontrado = await UsuarioModel.findById(req?.query?.id);
                if(!usuariosEncontrado){
                    return res.status(400).json({erro : 'Usuario nao encontrado'});
                }
                usuariosEncontrado.senha = null;
                return res.status(200).json(usuariosEncontrado);
            }else{
                const {filtro} = req.query;
                if(!filtro || filtro.length < 2){
                    return res.status(400).json({erro : 'Favor informar pelo menos 2 caracteres para a busca'});
                }
    
                const usuariosEncontrados = await UsuarioModel.find({
                  $or: [{nome : {$regex : filtro, $options : 'i'}},
                     { email : {$regex : filtro, $options : 'i'}}]
                });
    
                return res.status (200).json(usuariosEncontrados);
            }
            
         }
         return res.status(405).json({erro: 'Metodo infomado mao e valido'})
     }catch(e){
         console.log(e);
         return res.status(500).json({erro : 'Nao foi possivel buscar usuarios :' + e});
     }
 }

 
 export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint));
            
