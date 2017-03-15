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
            if (err) {
                res.json({success: false, message: "Error saving new group"})
            } else {
                res.json({success: true, group: group});
            }
        })
    });

    apiRoutes.put('/groups/:groupId', function (req, res) {
        isUserAdminOfGroup(req.decoded.user_id, req.params.groupId, function (admin) {
            if (admin) {
                Group.findByIdAndUpdate(req.params.groupId, req.body.group, {new: true}, function (err, doc) {
                    if (err) {
                        res.send(500, {success: false, message: "Group not found"});
                    }
                    else {
                        res.json({success: true, group: doc});
                    }
                });
            } else {
                res.status(403).send({success: false, message: "User is not admin!"});
            }
        });


    })

    apiRoutes.put('/groups/:groupId/addMember', function (req, res) {
        isUserAdminOfGroup(req.decoded.user_id, req.params.groupId, function (isUserAdmin) {
            if (!isUserAdmin){
                res.status(500).send({success: false, message: "User is no admin of group"});
            }else {
                doesUsersExist(req.body.members._id, function (userExist) {
                    if (userExist) {
                        Group
                            .findByIdAndUpdate(
                                req.params.groupId,
                                {
                                    $push: {
                                        "members": {
                                            _id: req.body.members._id, admin: false
                                        }
                                    }
                                },
                                {upsert: true},
                                function (err, model) {
                                    if (err){
                                        res.status(500).send({success: false, message: "Adding member failed"});
                                    }else{
                                        res.send({success: true, group: model});
                                    }

                                });
                    } else {
                        res.status(500).send({success: false, message: "User does not exist"});
                    }
                });
            }

        });


    })
}

isUserAdminOfGroup = function (user_id, group_id, callback) {
    Group
        .findById(group_id)
        .exec(function (err, group) {
            if (group.members.findIndex(function (element, index, array) {
                    return element._id === user_id && element.admin === true
                }) != -1) {
                callback(true);
            } else {
                callback(false);
            }

        });
}

doesUsersExist = function (user_id, callback) {
    User.
        findById(user_id, function (err, user) {
        if (err){
            callback(false);
        }else{
            callback(true);
        }
    })
}