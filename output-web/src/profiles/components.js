export function ProfileLink( props ) {
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
