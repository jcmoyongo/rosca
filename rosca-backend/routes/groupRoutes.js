const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new group
router.post('/', authMiddleware, groupController.createGroup);

// List groups for the logged-in user
router.get('/', authMiddleware, groupController.listGroups);

// Get a group by ID with members
router.get('/:id', authMiddleware, groupController.getGroupById);

// Update a member’s role in a group
router.patch('/:groupId/role', authMiddleware, groupController.updateMemberRole);

// Join group via invite token
router.post('/join/:token', authMiddleware, groupController.joinGroup);

router.post('/join', authMiddleware, groupController.joinGroupByInvite);

// Regenerate invite token (admin only)
router.patch('/:groupId/invite-token', authMiddleware, groupController.regenerateInviteToken);

// Leave a group
router.delete('/:groupId', authMiddleware, groupController.leaveGroup);



module.exports = router;
