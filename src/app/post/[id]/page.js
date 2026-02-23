// app/post/[id]/page.js (NEW FILE - Server Component)
import axios from 'axios';
import PostDetailClient from './PostDetailClient';

function getOgImage(url) {
  if (!url || !url.includes("/upload/")) return url;

  return url.replace(
    "/upload/",
    "/upload/w_1200,h_630,c_fill,f_jpg,q_80/"
  );
}

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;

    const result = await axios.get(`https://tnrat.com/api/post/get-post?id=${id}`);

    if (result?.data?.status === false) return null;

    const post = result?.data?.post;

    const ogImage = getOgImage(post?.images?.[0]);

    return {
      title: post?.team?.name,
      description: post?.description.substring(0, 160),
      openGraph: {
        title: post?.title,
        description: post?.description.substring(0, 160),
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post?.title,
          },
        ],
        url: `https://tnrat.com/post/${id}`,
        type: 'article',
        publishedTime: post?.caseDate || post?.createdAt,
        authors: post?.team?.name ? [post?.team?.name] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post?.title,
        description: post?.description?.substring(0, 160),
        images: [ogImage]
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Green Initiative',
      description: 'Environmental initiatives and activities',
    };
  }
}

export default async function PostPage({ params }) {
  try {
    const { id } = await params;

    console.log('prams id', id)

    const result = await axios.get(`https://tnrat.com/api/post/get-post?id=${id}`);

    if (result?.data?.status === false) return null;

    const post = result?.data?.post;

    return <PostDetailClient initialPost={post} />;
  } catch (error) {
    console.error('Error loading post:', error);
  }
}