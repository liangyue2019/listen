export class Response<T> {
    code: number = 0
    message: string = ''
    total?: number
    data?: T


}