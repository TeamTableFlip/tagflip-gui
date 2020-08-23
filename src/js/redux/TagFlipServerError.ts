import { TagFlipError, TagFlipErrorCode } from "@fhswf/tagflip-common";

class TagFlipServerError implements TagFlipError {

    internalErrorCode: TagFlipErrorCode;
    message: string;
    name: string;
    statusCode: number;


    constructor(statusCode: number, name: string, internalErrorCode: TagFlipErrorCode = -1, message: string = null) {
        this.internalErrorCode = internalErrorCode;
        this.message = message;
        this.name = name;
        this.statusCode = statusCode;
    }
}
