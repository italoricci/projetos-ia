import { Speaker } from './shared-types';

describe('Speaker Interface', () => {
  it('should enforce the Speaker structure', () => {
    const speaker: Speaker = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      talkTitle: 'Introduction to Angular',
      isGDE: true,
    };

    expect(speaker.id).toBe('1');
    expect(speaker.name).toBe('John Doe');
    expect(speaker.email).toBe('john@example.com');
    expect(speaker.talkTitle).toBe('Introduction to Angular');
    expect(speaker.isGDE).toBe(true);
  });
});
