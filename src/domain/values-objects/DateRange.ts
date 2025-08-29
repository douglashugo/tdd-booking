export class DateRange {

  private readonly startDate: Date;
  private readonly endDate: Date;
  
  constructor(startDate: Date, endDate: Date) {
    if (endDate <= startDate) {
      throw new Error('End date must be greater than start date')
    }

    this.startDate = startDate;
    this.endDate = endDate;
  }
};