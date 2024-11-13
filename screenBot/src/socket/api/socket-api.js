import io, { Socket } from 'socket.io-client'

export class SocketApt {
    static socket = null

    static createConnections() {
        this.socket = io(process.env.SERVER_AUTH_LINK, {auth: {token: {'Authorization': 'Bearer ' + 'hjhjhjhjhj'}}})

        this.socket.on('connect', () => {
            SocketApt.socket.emit('helloFromServer', process.env.SERVER_TOKEN)
            console.log('connect')
        })

        this.socket.on('disconnect', () => {
            console.log('disconnect')
        })

        this.socket.on('exception', (data) => {
            console.log(data)
        })

    }

}