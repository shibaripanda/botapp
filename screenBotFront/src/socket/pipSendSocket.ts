import { SocketApt } from "./api/socket-api.ts"


export const pipSendSocket = (pip, data) => {

    SocketApt.socket?.emit(pip, data)
    
}