import request from 'graphql-request'
import React from 'react'
import Head from 'next/head'
import { getAllPost, getPost } from '../../../graphql/queries/blog'
import ReactMarkDown from 'react-markdown'
import * as S from '../../../styles/pages/Blog/Post/styles'
import { useRouter } from 'next/router'
import BackButton from '../../../components/BackButton'
interface PostItem {
  post: {
    category: string
    content: { markdown: string }
    coverImage: { fileName: string; url: string }
    excerpt: string
    id: string
    publishedAt: string
    slug: string
    stage: string
    tags: string[]
    title: string
    author: {
      name: string
      picture: {
        url: string
      }
    }
    createdAt: string
  }
}

export const Post = ({ post }: PostItem) => {
  const router = useRouter()

  if (!post) return <h1>Não foi possivel encontrar este post ☹</h1>
  return (
    <S.Container className="container">
      <Head>
        <title>Blog - {post.title}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={router.asPath} />
        <meta property="og:type" content={`${post.tags}`} />
      </Head>
      <BackButton />
      <h1>{post.title}</h1>
      <div className="author">
        <img
          src={post.author.picture.url}
          title={post.author.name}
          alt={post.author.name}
        />
        <span>{post.author.name}</span>
      </div>
      <small>
        Postado em {new Date(post.createdAt).toLocaleDateString('pt-BR')}
      </small>
      <div className="tags">
        {post.tags.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <img src={post.coverImage.url} alt={post.title} className="post-img" />
      <div className="content">
        <ReactMarkDown>{post.content.markdown}</ReactMarkDown>
      </div>
    </S.Container>
  )
}

export const getStaticProps = async (context) => {
  try {
    const response = await request(process.env.GRAPHQL_URL, getPost, {
      slugName: context.params.slug,
    })
    const data = response.post

    if (data.length === 0 || !data) {
      return {
        notFound: true,
      }
    }

    return {
      props: { post: data },
    }
  } catch (err) {
    console.log(err)
    return {
      notFound: true,
    }
  }
}

export const getStaticPaths = async (context) => {
  const response = await request(process.env.GRAPHQL_URL, getAllPost)
  const paths = response.posts.map(({ slug }) => {
    return { params: { slug: slug } }
  })

  return {
    paths,
    fallback: true,
  }
}

export default Post
