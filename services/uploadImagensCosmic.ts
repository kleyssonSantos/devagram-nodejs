import multer from "multer";
import { createBucketClient } from '@cosmicjs/sdk';

const {
    MINHA_CHAVE_BUCKETSLUG,
    MINHA_CHAVE_READKEY,
    MINHA_CHAVE_WRITEKEY} = process.env;

    const meuBucketDevaria = createBucketClient({
        bucketSlug: MINHA_CHAVE_BUCKETSLUG as string,
        readKey: MINHA_CHAVE_READKEY as string,
        writeKey : MINHA_CHAVE_WRITEKEY as string
    });
    
    const storage = multer.memoryStorage();
    const upload = multer({
        storage: storage
    });
    
    const uploadImagemCosmic = async (req: any) => {
        if(req?.file?.originalname){
            const media_object={
                originalname: req.file.originalname,
                buffer: req.file.buffer,
            };
    
    
            if(req.url && req.url.includes('publicacao')){
                console.log('Imagem subiu para a pasta [publicacoes]')
                return await meuBucketDevaria.media.insertOne({
                    media: media_object,
                    folder: 'publicacoes'
                });
            }else{
                console.log('Imagem subiu para a pasta [avatares]');
                return await meuBucketDevaria.media.insertOne({
                    media: media_object,
                    folder: 'avatares'
                });
            }
        }
    }
    

export { upload, uploadImagemCosmic }; 
