
// === controllers/groupController.js ===
const { ROSCAGroup } = require('../models');

exports.createGroup = async (req, res) => {
    const { group_name, contribution_amount, contribution_interval, start_date } = req.body;
    const adminUserId = req.user.id;
    const group = await ROSCAGroup.create({
        group_name,
        contribution_amount,
        contribution_interval,
        start_date,
        adminUserId
    });
    res.json(group);
};

exports.listGroups = async (req, res) => {
    const groups = await ROSCAGroup.findAll({ where: { adminUserId: req.user.id } });
    res.json(groups);
};

// controllers/groupController.js
const { Group, User } = require('../models');

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email'], // customize fields
          through: { attributes: [] }, // remove join table data
        },
      ],
    });

    if (!group) return res.status(404).json({ message: 'Group not found' });

    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching group', error: err.message });
  }
};

// PATCH /groups/:groupId/role
exports.updateMemberRole = async (req, res) => {
  const { userId, role } = req.body;
  const { groupId } = req.params;

  await GroupMember.update({ role }, {
    where: { groupId, userId }
  });

  res.json({ message: 'Role updated' });
};
