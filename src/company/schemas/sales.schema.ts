import { StaffMember } from './staff-member.schema';
import { Manager } from './manager.schema';
import {Employee} from "./employee.schema";

export class Sales extends StaffMember{
  private subordinates: StaffMember[] = [];
  constructor(name: string, joined: string, baseSalary: number) {
    super(name, joined, baseSalary)
  }

  addSubordinate(name, joined, baseSalary, type): void {
    if (type === "Employee") {
      const employee = new Employee(name, joined, baseSalary)
      this.subordinates.push(employee);
    } else if (type === "Manager") {
      const manager = new Manager(name, joined, baseSalary)
      this.subordinates.push(manager);
    }
  }

  calcSalary(currentDate: Date): number {
    const [year, month, day] = this.joined.split('-').map(Number)
    const parsedDateJoin = new Date(year, month - 1, day)
    const yearsWorked = (currentDate.getFullYear() - parsedDateJoin.getFullYear())
    const maxIncrease = this.baseSalary * 0.35;
    let increase = 0
    for(let i = 0; i < yearsWorked; i++){
      increase += this.baseSalary * 0.01
    }
    const subordinatesIncrease = this.subordinates.reduce(
      (sum, subordinate) => sum + subordinate.calcSalary(currentDate),
      0,
    );

    return (
      this.baseSalary +
      Math.min(increase, maxIncrease) +
      0.003 * subordinatesIncrease
    );
  }
}
