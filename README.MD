## Backend for Imgex Node JS implementation

# Setup
install mongodb, nodejs, npm
clone
(import in WebStorm)
npm start

GENERAL MISSING Encryption key handling, first try without encryption

# API
/api/ --> root path  
#### Register/Login
POST /register   email, password in body-form, return success  
POST /login      email, password in body-form, return success, token  
___
#### Group
GET /groups        return success, groups  
MISSING GET /grouos/:groupId  
MISSING DELETE /groups/:groupId  
POST /groups     body-json: {"group":{"name": "name of group" }}, return success, group  
PUT /groups/:groupId    body-json: {"group":{"name": "name of group" }}, return success, group  
PUT /groups/:groupId/addMember  body-json: {members: {_id: "<user_id1>}"}, return success, group  
MISSING DELETE /groups/:groupId/deleteMembers 
MISSING DELETE /groups/:groupId/leave leave the group  
  
MISSING POST /groups/:groupId/addFile add a file to group  
MISSING DELETE /groups/:groupId/removeFile remove a file from group  
MISSING GET /grous/:groupId/getFile download a file from a group  
___
#### User
MISSING: GET /user user info, including friends...  
MISSING GET /user/:userId get nickname  
MISSING GET /user/search search for a user by nickname  
MISSING POST /user -->modify user details  
MISSING DELETE /user  







