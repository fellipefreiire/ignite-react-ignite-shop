import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Image from 'next/future/image'
import { useRouter } from 'next/router'

import Stripe from 'stripe'
import { stripe } from '../../lib/stripe'

import * as S from '../../styles/pages/product'

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
  }
}

const Product: NextPage<ProductProps> = ({ product }) => {
  const { isFallback } = useRouter()

  if (isFallback) {
    return <p>Loading</p>
  }

  return (
    <S.ProductContainer>
      <S.ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt='' />
      </S.ImageContainer>

      <S.ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>
        <p>{product.description}</p>

        <button>
          Comprar agora
        </button>
      </S.ProductDetails>
    </S.ProductContainer>
  )
}

export default Product

type ParamProps = {
  id: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: 'prod_MW6EwrI5ZpUh7S' } }
    ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<any, ParamProps> = async ({ params }) => {
  const productId = params!.id

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(price.unit_amount! / 100),
        description: product.description
      }
    },
    revalidate: 60 * 60 * 1 // 1 hour
  }
}