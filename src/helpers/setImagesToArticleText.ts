import {FilesActionName, ServiceName, UploadBuffersPayload, UploadBuffersResult} from "package-types";
import {App} from "package-app";

const allowedMimetypes = ['image/png', 'image/jpg', 'image/jpeg'];

export async function setImagesToArticleText(text: string): Promise<string> {
    const textParts = text.split('<img src="data:');
    const result: UploadBuffersPayload = {buffers: {}};
    let replacedText = '';
    textParts.forEach((part, index) => {
        const mimetypeAndBase64 = part.split(';base64,');
        if(mimetypeAndBase64.length > 1) {
            const mimetype = mimetypeAndBase64[0];
            if (allowedMimetypes.includes(mimetype)) {
                const indexOfEndBase64 = mimetypeAndBase64[1].indexOf('>');
                const base64 = mimetypeAndBase64[1].slice(0, indexOfEndBase64);
                const text = mimetypeAndBase64[1].slice(indexOfEndBase64);
                result.buffers[`image${index}.${mimetype.split('/').pop()}`] = new Buffer(base64, 'base64');
                const croppedPart = `<img src="<image${index}>" alt="asdas"/`;
                replacedText += croppedPart;
                replacedText += text;
            }
        } else {
            replacedText += part;
        }
    });
    if(Object.keys(result.buffers).length === 0) {
        return  replacedText;
    }

    const {fileKeys} = await App.call<UploadBuffersPayload, UploadBuffersResult>(ServiceName.Files, FilesActionName.UploadBuffers, result);
    let resultText = '';
    Object.keys(fileKeys).forEach((key) => {
        const searchValue = `<${key.split('.')[0]}>`
        resultText += replacedText.replace(`${searchValue}`, fileKeys[key]);
    });

    return resultText;
}
