import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useParams, Link } from "react-router-dom";
import { loadProfile, profileFollow, currentProfile, checkFollow } from "../lookup/";
import { ProfileBadge } from "./badges/";
import { ProfilePostsComponent } from "./posts";

export function ProfileComponent() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [current, setCurrent] = useState(null);
  const [mutualFollow, setMutualFollow] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const handleLookup = (response, status) => {
    if (status === 200) {
      setProfile(response);
      console.log(response.mutual_follow)
      setMutualFollow(response.mutual_follow);
    }
    if (status === 202) {
      setCurrent(response);
    }
  };

  useEffect(() => {
    loadProfile(handleLookup, username);
    currentProfile(handleLookup);
  }, [username]);

  useEffect(() => {
    if (profile) {
      const checkMutualFollow = async () => {
        try {
          checkFollow(handleLookup, username)
        } catch (error) {
          console.error('Error checking mutual follow:', error);
        }
      };

      checkMutualFollow();
    }
  }, [profile, username]);

  const handleFollow = (action) => {
    profileFollow(action, username, (response, status) => {
      if (status === 200) {
        setProfile(response);
      }
      setProfileLoading(false);
    });
    setProfileLoading(true);
  };

  if (profile && current) {
    return (
      <>
        <Link to="/">Go back to feed</Link>
        <ProfileBadge
          profile={profile}
          current={current}
          onFollow={handleFollow}
          profileLoading={profileLoading}
        />
        {(profile.username !== current.username) && mutualFollow && (
          <SendMessageButton targetUsername={username} />
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
  console.log(props.username);
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
  console.log(profile.username);
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
      const response = await axios.post(`/create/chat/${targetUsername}`);
      if (response.status === 201 || response.status === 200) {
        setChatId(response.data.chat_id);
        window.location.href = `chat/${chatId}/`;
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };
  return (
    <button onClick={handleCreateChat} className="font2">
      Send Message
    </button>
  );
}
