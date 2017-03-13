var User = require.main.require('./app/models/user');
var Group = require.main.require('./app/models/group')
var Device = require.main.require('./app/models/device')
var MediaContent = require.main.require('./app/models/mediaContent')

module.exports = function (mongoose, app, apiRoutes) {
    apiRoutes.get('/groups/', function (req, res) {

        Group
            .find({})
            .where('members._id').in([req.decoded.user_id])
            .exec(function (err, groups) {
                res.json({'group': groups});
            });
    });

    apiRoutes.post('/groups/', function (req, res) {
        var group = new Group({
            name: req.body.group.name,
            members: [{_id: req.decoded.user_id, admin: true}]

        });
        group.save(function (err) {
            if (err){
                res.json({success: false, message: "Error saving new group"})
            }else{
                res.json({success: true, group: group});
            }
        })
    });

    apiRoutes.put('/groups/:groupId', function (req, res) {
      isUserAdminOfGroup(req.decoded.user_id, req.params.groupId, function (admin) {
          if (admin){
          Group.findByIdAndUpdate(req.params.groupId, req.body.group, {new: true}, function (err, doc) {
              if (err) {
                  res.send(500, { success: false, message: "Group not found" });
              }
              else {
                  res.json({success: true, group: doc});
              }
          });
      }else{
            res.status(403).send({success: false, message: "User is not admin!"});
        }
      });





    })

    apiRoutes.put('/groups/:groupId/addMembers', function (req, res) {
        //tbd: check if user is admin of the group
        //tbd: check if requested user exist
        //tbd: not working for multiple users

        Group
            .findByIdAndUpdate(
            req.params.groupId,
            {$push: {
                "members": {
                $each: [{_id: "bla1", admin: false},{_id: "dada", admin: false}]
            }}},
            {safe: true, upsert: true},
            function(err, model) {
                res.status(500).send({ success: false, message: "Adding member failed" });
            });

    })
    


}

isUserAdminOfGroup = function (user_id, group_id, callback) {
    Group
        .findById(group_id)
        .exec(function (err, group) {
            if (group.members.findIndex(function (element, index, array) {
                    return element._id === user_id && element.admin === true
                }) != -1){
                return callback(true);
            }else{
                return callback(false);
            }

        });
}