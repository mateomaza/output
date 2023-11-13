import React from 'react'
import { ProfileDisplay, ProfilePicture } from '../components'
import { DisplayCount } from '../../utils'

export function ProfileBadge({ profile, current, onFollow, profileLoading }) {

    let action = (profile && profile.is_following) ? 'Unfollow' : 'Follow'
    action = profileLoading ? '...' : action

    const handleToggle = () => {
        if (onFollow && !profileLoading) {
            onFollow(action)
        }
    }
    return profile ? <div className='bg-white border border-info rounded col-5 mt-4 mb-2 p-5 mx-auto'>
        <ProfilePicture profile={profile} hideLink />
        <div className='mt-3 mb-4'><ProfileDisplay profile={profile} includeFullName hideLink /></div>
        <p className='font'><DisplayCount>{profile.followers_count}</DisplayCount> {profile.followers_count === 1 ? 'follower' : 'followers'} </p>
        <p className='font'><DisplayCount>{profile.following_count}</DisplayCount> following</p>
        <p className='font mt-5'>{profile.location}</p>
        <p className='font mt-4 mb-4'>{profile.bio}</p>
        {profile.username !== current.username && <button className='btn btn-primary font2 mt-4' onClick={handleToggle}>{action}</button>}
    </div> : null
}