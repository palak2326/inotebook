import React, { useState } from 'react'

const Demo = () => {
  const [a, seta] = useState(0)
  const handleClick = () => {
    seta(a + 2)
    console.log(a)
  }
  return (
    <div>
      my value {a}
      <button onClick={handleClick}>Click Me</button>
    </div>
  )
}

export default Demo
