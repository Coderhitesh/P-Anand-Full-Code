import React from 'react'

import axios from 'axios'
const TryHit = () => {

    const hitPayment = async () => {
        try {
            const { data } = await axios.post('https://www.api.panandacademy.com/api/v1/try',{
                headers: {
                    Referrer: 'strict-origin-when-cross-origin',
                  },
            })
            console.log(data.url)
            if (data.url) {
                window.location.href = data.url?.redirectInfo?.url
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <button onClick={() => hitPayment()}>Hit Me</button>
        </div>
    )
}

export default TryHit
