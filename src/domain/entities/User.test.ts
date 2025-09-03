import { User } from './User'

describe('User Entity', () => {
  it('should create instance the user with id and name', () => {
    const user = new User('1', 'João')
    expect(user.getId()).toBe('1')
    expect(user.getName()).toBe('João')
  })

  it('should throw error if id is empty', () => {
    expect(() => new User('', 'João')).toThrow('Id is required')
  })

  it('should throw error if name is empty', () => {
    expect(() => new User('1', '')).toThrow('Name is required')
  })
})