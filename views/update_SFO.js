// Update documents in the allpost collection
db.allpost.updateMany(
  {
    post_image: {
      $regex: '^https://northeastherald.sfo3.digitaloceanspaces.com/'
    }
  },
  [
    {
      $set: {
        post_image: {
          $split: ['$post_image', 'https://northeastherald.sfo3.digitaloceanspaces.com/']
        }
      }
    },
    {
      $set: {
        post_image: {
          $arrayElemAt: ['$post_image', 1]
        }
      }
    }
  ]
);

// Output a message indicating the update is complete
print('Documents updated.');
