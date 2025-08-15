// scripts/backfillUserPictures.js
const { User } = require('../models');

async function backfillPictures() {
  try {
    const defaultPicture = 'https://randomuser.me/api/portraits/lego/1.jpg';

    // Find all users with null or empty picture
    const users = await User.findAll({
      where: {
        picture: null
      }
    });

    console.log(`Found ${users.length} users without a picture.`);

    // Update each user
    for (const user of users) {
      user.picture = defaultPicture;
      await user.save();
      console.log(`Updated user ${user.id} with default picture.`);
    }

    console.log('All missing pictures have been backfilled.');
    process.exit(0);
  } catch (err) {
    console.error('Error backfilling pictures:', err);
    process.exit(1);
  }
}

backfillPictures();
