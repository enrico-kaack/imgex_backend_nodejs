##Backend for Imgex Node JS implementation

#Setup
install mongodb, nodejs, npm
clone
(import in WebStorm)
npm start

#API
/api/ --> root path
POST /register   email, password in body-form, return success
POST /login      email, password in body-form, return success, token
GET /groups        return success, groups
POST /groups     body-json: {"group":{"name": "name of group" }}, return success, group
PUT /groups/:groupId    body-json: {"group":{"name": "name of group" }}, return success, group
PUT /groups/:groupId/addMember  body-json: {members: ["<user_id1>", "<user_id2>"]}, return success, group