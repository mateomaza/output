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
    return profile ? <div>
        <ProfilePicture profile={profile} hideLink />
        <p><ProfileDisplay profile={profile} includeFullName hideLink /></p>
        <p><DisplayCount>{profile.follower_count}</DisplayCount> {profile.follower_count === 1 ? 'follower' : 'followers'} </p>
        <p><DisplayCount>{profile.following_count}</DisplayCount> following</p>
        <p>{profile.location}</p>
        <p>{profile.bio}</p>
        <button className='btn btn-primary' onClick={handleToggle}>{currentAction}</button>
    </div> : null
}