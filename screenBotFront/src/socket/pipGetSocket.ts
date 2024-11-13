import { SocketApt } from "./api/socket-api.ts"


export const pipGetSocket = (pips) => {

    for(const i of pips){
        SocketApt.socket?.on(i.pip, (data) => {
            i.handler(data)
        })
    }
    
}