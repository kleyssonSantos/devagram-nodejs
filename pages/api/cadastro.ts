import type { NextApiRequest, NextApiResponse } from "next";
import type {RespostaPadaoMsg} from '../../types/RespostaPadraoMsg';
import type {CadastroRequisicao} from '../../types/CadastroRequisicao';
import {UsuarioModel} from '../../models/UsuarioModel';
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import md5 from 'md5';
import {upload, uploadImagemCosmic} from '../../services/uploadImagensCosmic';
import nextConnect from "next-connect"; 

const handler = nextConnect()
    .use(upload.single('file'))
    .post (async (req : NextApiRequest, res : NextApiResponse<RespostaPadaoMsg>) => {
        
        const usuario = req.body as CadastroRequisicao;

        if(!usuario.nome || usuario.nome.length < 2){
            return res.status(400).json({erro : 'Nome invalido'});
        }

        if(!usuario.email || usuario.email.length< 5
            || !usuario.email.includes('@')
            || !usuario.email.includes('.')){
            return res.status(400).json({erro : 'Email invalido'}); 
         }

         if(!usuario.senha || usuario.senha.length< 4){
            return res.status(400).json({erro : 'Senha invalido'}); 
        }

        // validacao se ja existe usuario com o mesmo email
        const usuariosComMesmoEmail = await UsuarioModel.find({email : usuario.email});
        if(usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0){
            return res.status(400).json({erro : 'Ja existe conta com email informado'})
        }

        // enviar a imagem do multer para o cosmic
        const image = await uploadImagemCosmic(req)

        // salvar no banco de dados
        const usuarioASersalvo = {
            nome : usuario.nome,
            email : usuario.email,
            senha : md5(usuario.senha),
            avatar : image?.media?.url
        }

        await UsuarioModel.create(usuarioASersalvo);
        return res.status(200).json({msg : 'Usuario criado com sucesso'});
    }
)


export default conectarMongoDB (handler);

        
