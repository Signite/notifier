// export interface iApiError {
//     status: number,
//     message: string,
//     errors?: any[]
// }

export default class ApiError extends Error {

    status: number
    errors?: any[]

    constructor(status: number, message: string | undefined, errors?: any[] | undefined) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'User not authorized')
    }
    static NotFound(message: string) {
        return new ApiError(404, message);
    }

    static NotImplemented(message: string = "Method not implemented") {
        return new ApiError(501, message);
    }

    static BadRequest(message: string, errors = []) {
        return new ApiError(400, message, errors);
    }

    static InternalServerError(message: string, errors: any[] = []) {
        return new ApiError(500, message, errors);
    }


}