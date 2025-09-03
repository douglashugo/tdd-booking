export class DateRange {

  private readonly startDate: Date;
  private readonly endDate: Date;
  
  constructor(startDate: Date, endDate: Date) {
    this.validateDates(startDate, endDate);
    this.startDate = startDate;
    this.endDate = endDate;
  }

  private validateDates(startDate: Date, endDate: Date): void {
    if (endDate === startDate) {
      throw new Error('Start date and end date cannot be the same')
    } 
    if (endDate < startDate) {
      throw new Error('End date must be greater than start date')
    }
  }

  getStartDate(): Date {
    return this.startDate
  }

  getEndDate(): Date {
    return this.endDate
  }

  getTotalNights(): number {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays
  }

  overlaps(other: DateRange): boolean {
    return (
      this.startDate <= other.endDate &&
      this.getStartDate() < other.endDate
    )
  }
}; 