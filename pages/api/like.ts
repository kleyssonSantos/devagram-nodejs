import { NextApiRequest, NextApiResponse } from "next";
import {RespostaPadaoMsg} from '../../types/RespostaPadraoMsg';
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { UsuarioModel } from "@/models/UsuarioModel";
import { politicaCORS } from "@/middlewares/politicadeCors";

const likeEndpoint = async ( req : NextApiRequest, res : NextApiResponse <RespostaPadaoMsg> ) => {
try{
    // qual metodo deve usar ?
    if(req.method === 'PUT'){

        // id da publicacao - checked
        const {id} = req?.query;
        const publicacao = await PublicacaoModel.findById(id);
        if(!publicacao){
          return res.status(400).json({erro : 'Publicacao nao encontrada'});
        }
        // id do usuario que esta curtindo a pub ?
        const {userId} = req?.query;
        const usuario = await UsuarioModel.findById(userId);
        if(!usuario){
            return res.status(400).json({erro : 'Usuario nao encontrada'});
          }
          
          // administrar os likes
          const indexDoUsuarioNoLike = publicacao.likes.findIndex((e : any) => e.toString() === usuario._id.toString());
            
          //se o index for -1 sinal que ele nao curte a foto
          if(indexDoUsuarioNoLike != -1){
                publicacao.likes.splice(indexDoUsuarioNoLike, 1);
                await PublicacaoModel.findByIdAndUpdate({_id : publicacao.id}, publicacao);
            return res.status(200).json({msg : 'Publicacao descurtida com sucesso'});

          }else{
            // se a index for > -1 sinal que ela ja curte a foto
            publicacao.likes.push(usuario.id)
            await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
            return res.status(200).json({msg : 'Publicacao curtida com sucesso'});
          }
    }

    return res.status(405).json({erro : 'Metodo informado nao e valido'});
}catch(e){
    console.log(e);
    return res.status(500).json({erro : 'Ocorreu erro ao curtir/descurtir uma publicacao'})
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(likeEndpoint)));


        
