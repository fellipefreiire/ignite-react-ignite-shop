import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Product: NextPage = () => {
  const { query } = useRouter()

  return (
    <div>
      <h1>Hello World - Product {JSON.stringify(query)}</h1>
    </div>
  )
}

export default Product
