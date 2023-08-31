import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StaffMember } from './schemas/staff-member.schema';
import { Employee } from './schemas/employee.schema';
import { Manager } from './schemas/manager.schema';
import { Sales } from './schemas/sales.schema';

@Controller('company')
export class CompanyController {
  private staffMembers: StaffMember[] = [];

  @Post('/employee')
  createEmployee(@Body() staffMember: StaffMember) {
    const employee = new Employee(
      staffMember.name,
      staffMember.joined,
      staffMember.baseSalary,
    );

    return this.staffMembers.push(employee);
  }

  @Post('/manager')
  createManager(@Body() staffMember: StaffMember) {
    const manager = new Manager(
      staffMember.name,
      staffMember.joined,
      staffMember.baseSalary,
    );

    return this.staffMembers.push(manager);
  }

  @Post('/manager/subordinate')
  createManagerSubordinate(
    @Body('name') name,
    @Body() staffMember: StaffMember,
  ) {
    const manager = this.staffMembers.find(
      (manager) => manager.name === name,
    ) as Manager;
    if (manager) {
      manager.addSubordinate(staffMember.name,
          staffMember.joined,
          staffMember.baseSalary);
      this.staffMembers.push(staffMember);
    }
  }

  @Post('/sales')
  createSales(@Body() staffMember: StaffMember) {
    const sales = new Sales(
      staffMember.name,
      staffMember.joined,
      staffMember.baseSalary,
    );

    return this.staffMembers.push(sales);
  }

  @Post('/sales/subordinate')
  createSalesSubordinate(
    @Body('name') name,
    @Body('type') type,
    @Body() staffMember: StaffMember,
  ) {
    const sales = this.staffMembers.find(
      (sales) => sales.name === name,
    ) as Sales;
    if (sales) {
      sales.addSubordinate(staffMember.name,
          staffMember.joined,
          staffMember.baseSalary, type);
      const subordinate =
        type === 'Employee'
          ? new Employee(
              staffMember.name,
              staffMember.joined,
              staffMember.baseSalary,
            )
          : type === 'Manager'
          ? new Manager(
              staffMember.name,
              staffMember.joined,
              staffMember.baseSalary,
            )
          : null;
      this.staffMembers.push(subordinate);
    }
  }
  @Get('/total/:currentDate')
  calculateTotalSalary(@Param('currentDate') currentDateStr) {
    const [year, month, day] = currentDateStr.split('-').map(Number);
    const currentDate = new Date(year, month - 1, day);
    const result = [];
    for (const staffMember of this.staffMembers) {
      const salary = staffMember.calcSalary(currentDate);
      result.push({
        member: staffMember.name,
        salary,
      });
    }
    return result;
  }

  @Post('/:currentDate')
  calculateSalary(@Body('name') name, @Param('currentDate') currentDateStr) {
    const [year, month, day] = currentDateStr.split('-').map(Number);
    const currentDate = new Date(year, month - 1, day);
    return this.staffMembers
      .find((member) => member.name === name)
      .calcSalary(currentDate);
  }
}
