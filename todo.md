1. Posts
    -> Create
        -> Text
        -> Image -> Media Storage Server
        -> 'Loading...' Animation
        -> 'Tweet is too long' Error
    -> User Permissions
        -> Delete
        -> Re-post
            -> Read-only serializer
            -> Create serializer
        -> Like & Unlike

2. Users
    -> Register
    -> Login
    -> Logout
    -> Profile
        -> Image
        -> Text
        -> Follow Button
        -> Cancel-update button
    -> Feed
        -> User's feed
        -> User + who they follow

3. Following / Followers


? question about weird thing with testing using rest_framework's API client
! STYLING

Long term todos:

- Notifications
- DM
- Explore -> finding hastags
- Global feed
- Stars for memes



!!!

-PAGINATION FOR USER SEARCH BAR
-! profile pictures
-IMPLEMENT EMAIL VERIFICATION
-REQUIRE EMAIL VERIFICATION FOR POSTING IMAGES
-GOOGLE DRIVE CONFIGURATION

USER SEARCH BAR (PROGRESS) ->
Security: Make sure to validate and sanitize any user input before using it in a fetch URL to prevent security vulnerabilities like SQL injection or cross-site scripting (XSS) attacks.

-ONLINE MESSAGES (PROGRESS) =>
Remember to configure your server to support WebSocket connections if you're deploying your project in a production environment.
! real time notifications

-FORCE GOOGLE OAUTH JUST CREATED USERS TO SET THE PASSWORD BEFORE DOING ANYTHING ELSE (DONE)
-ONLY ALLOW USERS TO CHANGE THEIR USERNAME ONCE PER WEEK (DONE)

