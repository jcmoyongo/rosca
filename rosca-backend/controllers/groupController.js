const { ROSCAGroup, GroupMember, User, sequelize } = require('../models');
const crypto = require('crypto');

// ------------------
// Helper functions
// ------------------
async function findGroupById(groupId) {
  return await ROSCAGroup.findByPk(groupId);
}

async function findGroupByToken(token) {
  return await ROSCAGroup.findOne({ where: { inviteToken: token } });
}

async function isMember(groupId, userId) {
  return await GroupMember.findOne({ where: { groupId, userId } });
}

async function isAdmin(group, userId) {
  return group && group.adminUserId === userId;
}

// ------------------
// Controllers
// ------------------

// Create a group (transaction-safe)
exports.createGroup = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { group_name } = req.body;

    console.log("req.user:", req.user);
    console.log("req.body:", req.body);

    if (!req.user || !req.user.id) {
      await transaction.rollback();
      return res.status(401).json({ message: 'Unauthorized: Missing user context.' });
    }

    const userId = req.user.id;

    if (!group_name) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Group name is required.' });
    }

    const inviteToken = crypto.randomBytes(16).toString('hex');

    const group = await ROSCAGroup.create({
      group_name,
      adminUserId: userId,
      inviteToken
    }, { transaction });

    await GroupMember.create({
      groupId: group.id,
      userId,
      role: 'admin'
    }, { transaction });

    await transaction.commit();
    res.status(201).json({ message: 'Group created successfully.', group });
  } catch (err) {
    await transaction.rollback();
    console.error("Create group error:", err); // Add this
    res.status(500).json({ message: 'Error creating group', error: err.message });
  }
};

// List groups for the user
exports.listGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await ROSCAGroup.findAll({
      include: [{
        model: GroupMember,
        as: 'groupMembers',
        where: { userId },
        attributes: [] // optional: hides GroupMember fields
      }]
    });

    res.json(groups);
  } catch (err) {
    console.error('Error in listGroups:', err);
    res.status(500).json({ message: 'Error fetching groups', error: err.message });
  }
};


// Join a group by invite token (transaction-safe)
exports.joinGroup = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const token = req.params.token || req.body.token;
    const userId = req.user.id;

    if (!token) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invite token is required.' });
    }

    const group = await findGroupByToken(token);
    if (!group) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Invalid or expired invite token.' });
    }

    if (await isMember(group.id, userId)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Already a member of this group.' });
    }

    await GroupMember.create({
      groupId: group.id,
      userId,
      role: 'member'
    }, { transaction });

    await transaction.commit();
    res.json({ message: 'Joined group successfully', groupId: group.id });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: 'Error joining group', details: err.message });
  }
};

// Update member role (transaction-safe)
exports.updateMemberRole = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { groupId, memberId, role } = req.body;
    const userId = req.user.id;

    const group = await findGroupById(groupId);
    if (!group) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Group not found.' });
    }
    if (!(await isAdmin(group, userId))) {
      await transaction.rollback();
      return res.status(403).json({ message: 'Only admin can update roles.' });
    }

    const member = await isMember(groupId, memberId);
    if (!member) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Member not found in this group.' });
    }

    member.role = role;
    await member.save({ transaction });

    await transaction.commit();
    res.json({ message: 'Member role updated successfully.' });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error updating member role', error: err.message });
  }
};

// Leave a group (transaction-safe with auto admin transfer)
exports.leaveGroup = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const member = await isMember(groupId, userId);
    if (!member) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Not a member of this group.' });
    }

    const group = await findGroupById(groupId);
    if (!group) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Group not found.' });
    }

    // If user is admin, handle transfer logic
    if (await isAdmin(group, userId)) {
      const members = await GroupMember.findAll({ where: { groupId } });

      // No other members — delete group entirely
      if (members.length === 1) {
        await member.destroy({ transaction });
        await group.destroy({ transaction });
        await transaction.commit();
        return res.json({ message: 'You left and the group was deleted (no other members).' });
      }

      // Only one other member — auto-transfer admin rights
      if (members.length === 2) {
        const newAdmin = members.find(m => m.userId !== userId);
        group.adminUserId = newAdmin.userId;
        await group.save({ transaction });

        newAdmin.role = 'admin';
        await newAdmin.save({ transaction });

        await member.destroy({ transaction });
        await transaction.commit();
        return res.json({
          message: `You left and admin rights were automatically transferred to user ${newAdmin.userId}.`
        });
      }

      // More than two members — must transfer manually first
      await transaction.rollback();
      return res.status(400).json({
        message: 'Admin must transfer rights to another member before leaving.'
      });
    }

    // If not admin, just leave
    await member.destroy({ transaction });
    await transaction.commit();
    res.json({ message: 'Left the group successfully.' });

  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error leaving group', error: err.message });
  }
};

// Regenerate invite token (transaction-safe)
exports.regenerateInviteToken = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await findGroupById(groupId);
    if (!group) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Group not found.' });
    }
    if (!(await isAdmin(group, userId))) {
      await transaction.rollback();
      return res.status(403).json({ error: 'Only admin can regenerate invite token.' });
    }

    const newToken = crypto.randomBytes(16).toString('hex');
    group.inviteToken = newToken;
    await group.save({ transaction });

    await transaction.commit();
    res.json({ message: 'Invite token regenerated.', inviteToken: newToken });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: 'Error regenerating invite token.', details: err.message });
  }
};

// Get group by ID (read-only, no transaction needed)
exports.getGroupById = async (req, res) => {
  try {
    const group = await ROSCAGroup.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'name', 'email'],
        through: { attributes: [] }
      }]
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const groupData = group.toJSON();
    if (await isAdmin(group, req.user.id)) {
      groupData.inviteToken = group.inviteToken;
    }

    res.json(groupData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching group', error: err.message });
  }
};

// Join a group using an invite token (with expiration & one-time/limited use)
exports.joinGroupByInvite = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { inviteToken } = req.body;
    const userId = req.user.id;

    if (!inviteToken) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Invite token is required.' });
    }

    // Find group by invite token
    const group = await ROSCAGroup.findOne({ where: { inviteToken } });
    if (!group) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Invalid or expired invite token.' });
    }

    // Check expiration date
    if (group.inviteExpiresAt && new Date() > new Date(group.inviteExpiresAt)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'This invite has expired.' });
    }

    // Check max uses
    if (
      group.inviteMaxUses &&
      group.inviteUses >= group.inviteMaxUses
    ) {
      await transaction.rollback();
      return res.status(400).json({ message: 'This invite link has reached its maximum uses.' });
    }

    // Check if already a member
    const existingMember = await GroupMember.findOne({
      where: { groupId: group.id, userId }
    });
    if (existingMember) {
      await transaction.rollback();
      return res.status(400).json({ message: 'You are already a member of this group.' });
    }

    // Add user as a regular member
    await GroupMember.create(
      { groupId: group.id, userId, role: 'member' },
      { transaction }
    );

    // Increment usage count
    group.inviteUses = (group.inviteUses || 0) + 1;

    // If one-time use, nullify token
    if (group.inviteMaxUses === 1) {
      group.inviteToken = null;
      group.inviteExpiresAt = null;
    }

    await group.save({ transaction });
    await transaction.commit();

    res.json({ message: 'Successfully joined group via invite.', groupId: group.id });

  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error joining group via invite', error: err.message });
  }
};

// Transfer admin rights to another member (transaction-safe)
exports.transferAdminRights = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { groupId, newAdminId } = req.body;
    const userId = req.user.id;

    const group = await findGroupById(groupId);
    if (!group) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Group not found.' });
    }

    // Only current admin can transfer rights
    if (!(await isAdmin(group, userId))) {
      await transaction.rollback();
      return res.status(403).json({ message: 'Only the current admin can transfer admin rights.' });
    }

    // Check that the new admin is a member
    const newAdminMember = await isMember(groupId, newAdminId);
    if (!newAdminMember) {
      await transaction.rollback();
      return res.status(404).json({ message: 'New admin must be an existing member of the group.' });
    }

    // Update group admin
    group.adminUserId = newAdminId;
    await group.save({ transaction });

    // Update roles
    const currentAdminMember = await isMember(groupId, userId);
    if (currentAdminMember) {
      currentAdminMember.role = 'member';
      await currentAdminMember.save({ transaction });
    }

    newAdminMember.role = 'admin';
    await newAdminMember.save({ transaction });

    await transaction.commit();
    res.json({ message: 'Admin rights transferred successfully.' });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error transferring admin rights', error: err.message });
  }
};

