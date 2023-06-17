import multer from "multer";
import { createBucketClient } from '@cosmicjs/sdk';

const meuBucketDevaria = createBucketClient({
    bucketSlug: 'devagram-devaria',
    readKey: 'usI6yYLKeHrDBSgX1AC3HQRFfdy6A4O8OxutxxLCnBWpRScI8i',
    writeKey : 'icaq4V8vC1quDPGIZGcE7l8uTDIsT2H2cJjSC1fYdlvOcDRADW'
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
