import { LoginButton } from '@telegram-auth/react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { fix } from '../fix/fix'

export function TelegramVidget() {
    const navigate = useNavigate()
    return (
        <div>
            <LoginButton
                botUsername={fix.botName}
                onAuthCallback={async (data) => {
                    return await axios({
                      method: 'POST',
                      url: `${fix.serverLink}/auth/login`,
                      data: data,
                      timeout: 10000
                    })
                    .then(async (res) => {
                        console.log(res.data)
                        sessionStorage.setItem('token', res.data.token)
                        navigate('/main')

                    })
                    .catch((er) => {
                        console.log(er)
                        sessionStorage.removeItem('token')
                    })
                }}
            />
        </div>
    )
}
