import { describe, it, expect } from 'vitest';
import { getProfileImage } from '../../utils/profileImage';

describe('profileImage utility', () => {
  it('should return profile image if available', () => {
    const user = {
      profile_image: '/assets/profile.jpg',
    };

    const result = getProfileImage(user);
    expect(result).toBe('/assets/profile.jpg');
  });

  it('should return default avatar if no profile image', () => {
    const user = {
      profile_image: null,
    };

    const result = getProfileImage(user);
    expect(result).toBe('/assets/default-avatar.png');
  });

  it('should return default avatar if user is null', () => {
    const result = getProfileImage(null);
    expect(result).toBe('/assets/default-avatar.png');
  });

  it('should return default avatar if user is undefined', () => {
    const result = getProfileImage(undefined);
    expect(result).toBe('/assets/default-avatar.png');
  });
});

