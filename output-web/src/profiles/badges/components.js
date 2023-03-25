import { ProfileDisplay, ProfilePicture } from '../components'

import { DisplayCount } from '../../utils'

export function ProfileBadge({ profile, onFollow, profileLoading }) {

    let currentAction = (profile && profile.is_following) ? 'Unfollow' : 'Follow'
    currentAction = profileLoading ? '...' : currentAction

    const handleToggle = () => {
        if (onFollow && !profileLoading) {
            onFollow(currentAction)
        }
    }
    return profile ? <div className='bg-white border border-info rounded col-4 my-5 p-5 mx-auto'>
        <ProfilePicture profile={profile} hideLink />
        <div><ProfileDisplay profile={profile} includeFullName hideLink /></div>
        <p className='font'><DisplayCount>{profile.followers_count}</DisplayCount> {profile.followers_count === 1 ? 'follower' : 'followers'} </p>
        <p className='font'><DisplayCount>{profile.following_count}</DisplayCount> following</p>
        <p>{profile.location}</p>
        <p>{profile.bio}</p>
        <button></button>
        <button className='btn btn-primary font2' onClick={handleToggle}>{currentAction}</button>
    </div> : null
}