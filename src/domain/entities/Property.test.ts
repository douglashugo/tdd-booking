import { Property } from './Property'
import { DateRange } from '../values-objects/DateRange'
import { Booking } from './Booking'
import { User } from './User'

describe('Property Entity', () => {
  it('should create instance the property with id, name...', () => {
    const property = new Property('1', 'House', 'A house in the middle in nature', 4, 200)
    expect(property.getId()).toBe('1')
    expect(property.getName()).toBe('House')
    expect(property.getDescription()).toBe('A house in the middle in nature')
    expect(property.getMaxGuests()).toBe(4)
    expect(property.getBasePricePerNight()).toBe(200)
  })

  it('should throw error if id is empty', () => {
    expect(() => new Property('', 'House', 'A house in the middle in nature', 4, 200)).toThrow()
  })

  it('should throw error if name is empty', () => {
    expect(() => new Property('1', '', 'A house in the middle in nature', 4, 200)).toThrow()
  })

  it('should throw error if number of guests is zero or negative', () => {
    expect(() => new Property('1', 'House', 'A house in the middle in nature', 0, 200)).toThrow()
    expect(() => new Property('1', 'House', 'A house in the middle in nature', -2, 200)).toThrow()
  })

  it('should number of guests not be exceed max guests', () => {
    const property = new Property('1', 'House', 'A house in the middle in nature', 5, 200)
    expect(() => {
      property.validateGuestsCount(6)
    }).toThrow('Number of guests exceeds max allowed')
  })

  it('not should apply descount if number nights is less than 7', () => {
    const property = new Property('1', 'House', 'A house in the middle in nature', 5, 100)
    const dateRange = new DateRange(
      new Date('2023-10-10'),
      new Date('2023-10-16')
    )
    const totalPrice = property.calculateTotalPrice(dateRange)
    expect(totalPrice).toBe(600)
  })

  it('should verify disponibility of property', () => {
    const property = new Property('1', 'House', 'A house in the middle in nature', 5, 100)
    const user =  new User('1', 'João');
    const dataRange = new DateRange(new Date('2023-10-10'), new Date('2023-10-16'));
    const dataRange2 = new DateRange(new Date('2023-10-16'), new Date('2023-10-20'));

    new Booking('1', property, user, dataRange, 2);
    
    expect(property.isAvailable(dataRange)).toBe(false);
    expect(property.isAvailable(dataRange2)).toBe(false);
  });

})