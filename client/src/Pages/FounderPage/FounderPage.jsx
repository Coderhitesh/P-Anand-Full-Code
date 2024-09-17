import React from 'react'
import { useParams } from 'react-router-dom'

function FounderPage() {
    const {name} = useParams()
    console.log(name)
    const data = [
        {
            id:1,
            // name:
        }
    ]
  return (
    <div>
      {/* fdjks */}
    </div>
  )
}

export default FounderPage
