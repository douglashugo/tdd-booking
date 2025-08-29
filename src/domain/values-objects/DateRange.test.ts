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
  })
})