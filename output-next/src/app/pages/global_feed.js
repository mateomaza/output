import GlobalFeedComponent from 'feed';

function GlobalFeed() {
    return <div className="App">
      <div className='bg-dark'>
        <GlobalFeedComponent {...(root.dataset)} />
      </div>
    </div>
  }