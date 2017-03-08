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
        //tbd: check if user is admin of the group

        Group.findByIdAndUpdate(req.params.groupId, req.body.group, function (err, doc) {
            if (err) {
                return res.send(500, { success: false, message: "Group not found" });
            }
            else {
                return res.json({success: true, group: doc});
            }
        })
        
    })

    apiRoutes.put('/groups/:groupId/addMember', function (req, res) {
        //tbd: check if user is admin of the group
        //tbd: check if requested user exist
        //tbd: untested

        Group
            .findByID(req.params.groupId)
            .exec(function (err, group) {
                if (err) {
                    res.send(500, { success: false, message: "Group not found" });
                }
                else {
                    group.members.push(req.body.members);
                    group.save(function (err, group) {
                        if (err) {
                            res.send(500, { success: false, message: "Group could not be modified" });
                        }else{
                            res.json({success: true, group: group});
                        }

                    })
                }
            });

    })


}