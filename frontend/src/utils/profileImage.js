export const getProfileImage = (user = null, userId = null) => {
  if (user?.profile_image) return user.profile_image;
  if (user?.profileImage) return user.profileImage;

  const images = [
    '/assets/profilePic1 (1).jpg',
    '/assets/profilePic1 (2).jpg',
    '/assets/profilePic1 (3).jpg',
    '/assets/profilePic1 (4).jpg',
    '/assets/profilePic1 (5).jpg',
    '/assets/profilePic1 (6).jpg',
    '/assets/profilePic1 (7).jpg',
    '/assets/profilePic1 (8).jpg',
  ];

  const idToUse = userId || user?.id;
  if (idToUse) {
    const hash = idToUse.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return images[hash % images.length];
  }

  return images[Math.floor(Math.random() * images.length)];
};

