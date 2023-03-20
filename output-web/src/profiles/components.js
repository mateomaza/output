import { useEffect, useState } from 'react'
import { loadProfile, profileFollow } from '../lookup/functions'
import { ProfileBadge } from './badges/components'

export function ProfilesComponent({ username }) 
{
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
            loadProfile(username, handleLookup)
            setDidLookup(true)
        }
    }, [username, didLookup, setDidLookup])

    const handleFollow = (action) => {
        profileFollow(username, action, (response, status) => {
            if (status === 200) {
                setProfile(response)
            }
            setProfileLoading(false)
        })
        setProfileLoading(true)

    }
    return didLookup === false ? '...' : profile ? <ProfileBadge profile={profile} onFollow={handleFollow} profileLoading={profileLoading} /> : null
}

export function ProfileLink(props) {
    const handleProfileLink = () => {
        window.location.href = `/profiles/${props.username}`
    }
    return <span className='pointer' onClick={handleProfileLink}>{props.children}</span>
}

export function ProfileDisplay({ profile, includeName }) {
    const nameDisplay = includeName === true ? `${profile.first_name} ${profile.last_name} ` : null

    return <>
        {nameDisplay}
        <ProfileLink username={profile.username}>@{profile.username}</ProfileLink>
    </>
}

export function ProfilePicture({ profile }) {
    return <ProfileLink username={profile.username}>
        <span className='mx-3 px-3 py-2 rounded-circle bg-dark text-white'>{profile.username[0]}</span>
    </ProfileLink>
}
