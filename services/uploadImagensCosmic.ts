import multer from "multer";
import { createBucketClient } from '@cosmicjs/sdk';

const {
    BUCKETSLUG,
    READKEY,
    WRITEKEY} = process.env;

const meuBucketDevaria = createBucketClient({
    bucketSlug: BUCKETSLUG as string,
    readKey: READKEY as string,
    writeKey : WRITEKEY as string
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
