export abstract class StaffMember {
  constructor(
      public name: string,
      public joined: string,
      public baseSalary: number
  ) {}

  abstract calcSalary(currentDate: Date): number;
}