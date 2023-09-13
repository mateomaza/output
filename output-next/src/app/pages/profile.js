import ProfileComponent from 'profiles';

function Profile() {
    return <div className="App">
      <div className='bg-dark'>
        <ProfileComponent {...(root.dataset)} />
      </div>
    </div>
  }