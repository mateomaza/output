function Profile() {
    return <div className="App">
      <div className='bg-dark'>
        <ProfileComponent {...(root.dataset)} />
      </div>
    </div>
  }