import type { NextApiRequest, NextApiResponse } from "next";
import type {RespostaPadaoMsg} from '../../types/RespostaPadraoMsg';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import { UsuarioModel } from "@/models/UsuarioModel";
import nextConnect from "next-connect";
import {upload, uploadImagemCosmic} from '../../services/uploadImagensCosmic';
import { politicaCORS } from "@/middlewares/politicadeCors";


    const handler = nextConnect()
    .use(upload.single('file'))
    .put(async(req : any, res : NextApiResponse<RespostaPadaoMsg>) => {
        try{
            const {userId}= req?.query;
            const usuario = await UsuarioModel.findById(userId);

            if(!usuario){
                return res.status(400).json({erro : 'Usuario nao encontrado'})
            }

            const {nome} = req.body;
            if(nome && nome.length >2){
               usuario.nome = nome;
            }

            const {file} = req;
            if(file && file.originalname){
                const image = await uploadImagemCosmic(req);
                if(image && image.media && image.media.url){
                    usuario.avatar = image.media.url;
                }
            }
            await UsuarioModel.findByIdAndUpdate({_id : usuario._id}, usuario);

            return res.status (200).json({msg : 'Usuario alterado com sucesso'});
             }catch(e){
            console.log(e); 
            return res.status(400).json({erro : 'Nao foi possivel atualizar usuario' + e});
        }
})
.get(async (req : NextApiRequest, res : NextApiResponse<RespostaPadaoMsg | any>) => {

    try {
        if(req.method === 'PUT'){
        }
        const {userId} = req?.query;
        const usuario = await UsuarioModel.findById(userId);
        console.log('usuario', usuario)
        usuario.senha = null;
        return res.status(200).json(usuario);
    }catch(e){
    console.log(e);
}

return res.status(400).json({erro : 'Nao foi possivel obter dados so usuario'})
});

export const config = {
    api : {
        bodyParser : false 
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(handler)));

        
      
       

  
  
