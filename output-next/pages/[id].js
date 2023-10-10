import { useRouter } from 'next/router';
import PostDetail from '../src/app/posts/index'

function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  return <div className="App">
      <div className='bg-dark'>
        <PostDetail id={id} />
      </div>
    </div>
}

export default PostDetailPage