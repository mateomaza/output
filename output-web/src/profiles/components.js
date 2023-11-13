import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { loadProfile, profileFollow, currentProfile } from "../lookup/";
import { ProfileBadge } from "./badges/";
import { ProfilePostsComponent } from "./posts";

export function ProfileComponent() {
  const { username } = useParams();
  const [didLookup, setDidLookup] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [current, setCurrent] = useState(null);

  const handleLookup = (response, status) => {
    if (status === 200) {
      setProfile(response);
    }
    if (status === 202) {
      setCurrent(response);
    }
  };
  useEffect(() => {
    if (didLookup === false) {
      loadProfile(handleLookup, username);
      currentProfile(handleLookup);
      setDidLookup(true);
    }
  }, [username, didLookup, setDidLookup]);

  const handleFollow = (action) => {
    profileFollow(action, username, (response, status) => {
      if (status === 200) {
        setProfile(response);
      }
      setProfileLoading(false);
    });
    setProfileLoading(true);
  };
  const handleUpdate = () => {
    window.location.href = "/profiles/update";
  };
  if (didLookup === true && profile && current) {
    return (
      <>
        <ProfileBadge
          profile={profile}
          current={current}
          onFollow={handleFollow}
          profileLoading={profileLoading}
        />
        {profile.username === current.username && (
          <SendMessageButton/>
        )}
        <div className="mt-5">
          <ProfilePostsComponent username={username} />
        </div>
      </>
    );
  } else {
    return "...";
  }
}

export function ProfileLink(props) {
  console.log(props.username)
  const handleProfileLink = () => {
    window.location.href = `/profiles/${props.username}`;
  };
  return (
    <span className="pointer" onClick={handleProfileLink}>
      {props.children}
    </span>
  );
}

export function ProfileDisplay({ profile, includeName, hideLink }) {
  console.log(profile.username)
  const nameDisplay =
    includeName === true ? `${profile.first_name} ${profile.last_name} ` : null;

  return (
    <>
      {nameDisplay}
      {hideLink === true ? (
        <p className="text-info mt-2 border-bottom font3">
          @{profile.username}
        </p>
      ) : (
        <ProfileLink username={profile.username}>
          @{profile.username}
        </ProfileLink>
      )}
    </>
  );
}

export function ProfilePicture({ profile }) {
  return (
    <ProfileLink username={profile.username}>
      <span className="mx-3 px-3 py-2 rounded-circle bg-dark text-white">
        {profile.username[0]}
      </span>
    </ProfileLink>
  );
}

function SendMessageButton({ targetUsername }) {
  const [chatId, setChatId] = useState(null);

  const handleCreateChat = async () => {
      try {
          const response = await axios.post(`/api/create_chat/${targetUsername}`);
          if (response.status === 201 || response.status === 200) {
              setChatId(response.data.chat_id);
          } else {
              console.error(response.data.message);
          }
      } catch (error) {
          console.error('Error creating chat:', error);
      }
  };
  return (
      <button onClick={handleCreateChat} className="font2">Send Message</button>
  );
}
