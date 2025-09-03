import { DateRange } from './DateRange'

describe('DateRange Value Object', () => {
  it('should check if the end date is greater than start date', () => {
    expect(() => {
      const startDate = new Date('2022-01-01')
      const endDate = new Date('2021-02-03')
      const dateRange = new DateRange(startDate, endDate)

    }).toThrow('End date must be greater than start date')
  })

  it('create instance the DateRange with start date and end date', () => {
    const startDate = new Date('2022-01-01')
    const endDate = new Date('2022-01-04')
    const dateRange = new DateRange(startDate, endDate)
    expect(dateRange.getStartDate()).toEqual(startDate )
    expect(dateRange.getEndDate()).toEqual(endDate)
  })

  it('should calculate the number nights', () => {
    const startDate = new Date('2022-01-01')
    const endDate = new Date('2022-01-04')
    const dateRange = new DateRange(startDate, endDate)
    expect(dateRange.getTotalNights()).toEqual(3)
  })

  it('should check if two interval the dates overlap', () => {
    const dateRange1 = new DateRange(
      new Date('2022-01-01'), 
      new Date('2022-01-04')
    )

    const dateRange2 = new DateRange(
      new Date('2022-01-03'),
      new Date('2022-01-06')
    )

    const overlaps = dateRange1.overlaps(dateRange2)

    expect(overlaps).toBe(true)
  })

  it('should check if end date is equal than start date', () => {
    expect(() => {
      const startDate = new Date('2022-01-01')
      const endDate = new Date('2022-01-01')
      const dateRange = new DateRange(startDate, endDate) 
    }).toThrow('End date must be greater than start date')
  })
})
