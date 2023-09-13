import PersonalFeedComponent from 'feed';

function Feed() {
    return <div className="App">
      <div className='bg-dark'>
        <PersonalFeedComponent {...(root.dataset)} />
      </div>
    </div>
  }