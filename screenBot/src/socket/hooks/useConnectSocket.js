import { SocketApt } from "../api/socket-api.js"

export const useConnectSocket = () => {

    const connectSocket = () => {
        SocketApt.createConnections()
    }
    
    connectSocket()
}