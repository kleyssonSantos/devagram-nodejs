import type { NextApiRequest, NextApiResponse } from "next";
import type {RespostaPadaoMsg} from '../../types/RespostaPadraoMsg';
import type {CadastroRequisicao} from '../../types/CadastroRequisicao';
import {UsuarioModel} from '../../models/UsuarioModel';
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import md5 from 'md5';

const endpointCadastro = 
    async (req : NextApiRequest, res : NextApiResponse<RespostaPadaoMsg>) => {
        if(req.method === 'POST') {
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

            // salvar no banco de dados
            const usuarioASersalvo = {
                nome : usuario.nome,
                email : usuario.email,
                senha : md5(usuario.senha)
            }

            await UsuarioModel.create(usuarioASersalvo);
            return res.status(200).json({msg : 'Usuario criado com sucesso'});
        }
        return res.status(405).json({erro : 'Metodo informado nao e valido'});
    }

    export default conectarMongoDB(endpointCadastro);
