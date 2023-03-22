import { useEffect, useState } from 'react'
import { loadProfile, profileFollow } from '../lookup/'
import { ProfileBadge } from './badges/'
import { ProfilePostsComponent } from './posts'
import { PostsList } from '../posts/'

export function ProfilesComponent({ username }) {

    const [didLookup, setDidLookup] = useState(false)
    const [profile, setProfile] = useState(null)
    const [profileLoading, setProfileLoading] = useState(false)

    const handleLookup = (response, status) => {
        if (status === 200) {
            setProfile(response)
        }
    }
    useEffect(() => {
        if (didLookup === false) {
            loadProfile(handleLookup, username)
            setDidLookup(true)
        }
    }, [username, didLookup, setDidLookup])

    const handleFollow = (action) => {
        profileFollow(action, username, (response, status) => {
            if (status === 200) {
                setProfile(response)
            }
            setProfileLoading(false)
        })
        setProfileLoading(true)
    }
    if (didLookup === true && profile) {
        return <>
            <ProfileBadge profile={profile} onFollow={handleFollow} profileLoading={profileLoading} />
            <ProfilePostsComponent username={username}/>
        </>
    } else {
        return '...'
    }
}

export function ProfileLink(props) {
    const handleProfileLink = () => {
        window.location.href = `/profiles/${props.username}`
    }
    return <span className='pointer' onClick={handleProfileLink}>{props.children}</span>
}

export function ProfileDisplay({ profile, includeName, hideLink }) {

    const nameDisplay = includeName === true ? `${profile.first_name} ${profile.last_name} ` : null

    return <>
        {nameDisplay}
        {hideLink === true ? <p className='text-info mt-2 border-bottom font3'>@{profile.username}</p> : <ProfileLink username={profile.username}>@{profile.username}</ProfileLink>}
    </>
}

export function ProfilePicture({ profile }) {
    return <ProfileLink username={profile.username}>
        <span className='mx-3 px-3 py-2 rounded-circle bg-dark text-white'>{profile.username[0]}</span>
    </ProfileLink>
}

export function ProfilePosts({ profilePosts }) {
    return <PostsList posts={profilePosts} />
}
