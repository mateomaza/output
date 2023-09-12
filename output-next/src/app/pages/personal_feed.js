function Feed() {
    return <div className="App">
      <div className='bg-dark'>
        <FeedComponent {...(root.dataset)} />
      </div>
    </div>
  }