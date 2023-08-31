import { StaffMember } from './staff-member.schema';
import { Employee } from "./employee.schema";

export class Manager extends StaffMember{
  private subordinates: StaffMember[] = [];
  constructor(name: string, joined: string, baseSalary: number) {
    super(name, joined, baseSalary)
  }

  addSubordinate(name, joined, baseSalary): void {
    const employee = new Employee(name, joined, baseSalary)
    this.subordinates.push(employee);
  }

  calcSalary(currentDate: Date): number {
    const [year, month, day] = this.joined.split('-').map(Number)
    const parsedDateJoin = new Date(year, month - 1, day)
    const yearsWorked = (currentDate.getFullYear() - parsedDateJoin.getFullYear())
    const maxIncrease = this.baseSalary * 0.4;
    let increase = 0
    for(let i = 0; i < yearsWorked; i++) {
      increase += this.baseSalary * 0.05
    }
    const subordinatesSalary = this.subordinates.reduce(
        (sum, subordinate) => sum + subordinate.calcSalary(currentDate),
        0,
    );

    return (
        this.baseSalary +
        Math.min(maxIncrease, increase) +
        (0.005 * subordinatesSalary)
    );
  }
}
