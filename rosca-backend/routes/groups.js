// === routes/groups.js ===
const express = require('express');
const router = express.Router();
const { createGroup, listGroups } = require('../controllers/groupController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/create', authenticate, createGroup);
router.get('/list', authenticate, listGroups);

const { GroupMember, RoscaGroup } = require('../models');
const { verifyToken } = require('../../utils/jwt');

// models/Group.js
inviteToken: {
  type: DataTypes.STRING,
  unique: true,
}


router.get('/my-groups', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    const groups = await GroupMember.findAll({
      where: { user_id: payload.id },
      include: [{ model: RoscaGroup }]
    });

    const formatted = groups.map(g => ({
      groupId: g.rosca_group_id,
      groupName: g.RoscaGroup.group_name,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});


router.post('/create', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed token' });
    }

    inviteToken: {
  type: DataTypes.STRING,
  unique: true,
},

    const token = authHeader.split(' ')[1];
    console.log("🔐 Auth Header:", req.headers.authorization);

    const { id: userId } = verifyToken(token);

    const group = await RoscaGroup.create({ group_name: req.body.groupName });

    await GroupMember.create({
      user_id: userId,
      rosca_group_id: group.id,
    });

    res.json({ success: true, groupId: group.id });
  } catch (err) {
    if (err.message === 'Invalid token') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.error(err);
    res.status(500).json({ error: 'Could not create group' });
  }
});

router.post('/join', async (req, res) => {
  try {
    const { groupId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const { id: userId } = verifyToken(token);

    const group = await RoscaGroup.findByPk(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const existing = await GroupMember.findOne({
      where: { user_id: userId, rosca_group_id: groupId }
    });

    if (existing) return res.status(400).json({ error: 'Already a member' });

    await GroupMember.create({
      user_id: userId,
      rosca_group_id: groupId,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

// POST /groups/join
exports.joinByToken = async (req, res) => {
  const { inviteToken } = req.body;
  const group = await Group.findOne({ where: { inviteToken } });

  if (!group) return res.status(404).json({ message: 'Invalid invite token' });

  await GroupMember.create({ userId: req.user.id, groupId: group.id });
  res.json({ message: 'Joined group', group });
};



module.exports = router;