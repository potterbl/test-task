import { StaffMember } from './staff-member.schema';

export class Employee extends StaffMember{
    constructor(name: string, joined: string, baseSalary: number) {
        super(name, joined, baseSalary)
    }

  calcSalary(currentDate: Date): number{
        const [year, month, day] = this.joined.split('-').map(Number)
const parsedDateJoin = new Date(year, month - 1, day)
      const yearsWorked = (currentDate.getFullYear() - parsedDateJoin.getFullYear())
      const maxIncrease = this.baseSalary * 0.3
      let increase = 0
      for(let i = 0; i < yearsWorked; i++){
          increase += this.baseSalary * 0.03
      }

      return this.baseSalary + Math.min(maxIncrease, increase)
  }
}
