import io, { Socket } from 'socket.io-client'
import { fix } from '../../fix/fix'

export class SocketApt {

    static socket: null | Socket = null

    static createConnections(): void {
        this.socket = io(process.env.REACT_APP_SERVERAUTHLINK, {auth: {token: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}}})

        this.socket.on('connect', () => {
            console.log('connect')
        })

        this.socket.on('disconnect', () => {
            console.log('disconnect')
        })

        this.socket.on('exception', (data) => {
            console.log(data)
            window.location.assign(process.env.REACT_APP_BOTNAME!)
        })

    }

}