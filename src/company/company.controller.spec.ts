import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import {Sales} from "./schemas/sales.schema";
import {Employee} from "./schemas/employee.schema";
import {Manager} from "./schemas/manager.schema";

describe('CompanyController', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
describe('Sales class', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });
  it('should calculate salary correctly for Sales instance without subordinates', () => {
    const currentDateStr = '2023-08-31';
    const sales = new Sales('John Doe', '2020-02-04', 50000);
    controller.createSales(sales)

    const calculatedSalary = controller.calculateSalary('John Doe', currentDateStr);

    expect(calculatedSalary).toBeCloseTo(51500);
  });

  it('should calculate salary correctly for Sales instance with subordinates', () => {
    const currentDateStr = '2023-08-31';
    const sales = new Sales('Jane Smith', '2020-02-04', 60000);
    controller.createSales(sales)
    const employee = new Employee('Subordinate Employee', '2021-02-04', 40000);
    const manager = new Manager('Subordinate Manager', '2021-02-04', 40000);
    controller.createSalesSubordinate('Jane Smith', 'Employee', employee);
    controller.createSalesSubordinate('Jane Smith', 'Manager', manager);

    const calculatedSalary = controller.calculateSalary('Jane Smith', currentDateStr);

    expect(calculatedSalary).toBeCloseTo(62059.2);
  });
});

describe('Manager class', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });
  it('should calculate salary correctly for Manager instance without subordinates', () => {
    const currentDateStr = '2023-08-31';
    const manager = new Manager('Michael Johnson', '2020-02-04', 55000);
    controller.createManager(manager)

    const calculatedSalary = controller.calculateSalary('Michael Johnson', currentDateStr)

    expect(calculatedSalary).toBeCloseTo(63250);
  });

  it('should calculate salary correctly for Manager instance with subordinates', () => {
    const currentDateStr = '2023-08-31';
    const manager = new Manager('Emily Brown', '2020-02-04', 55000);
    controller.createManager(manager)
    const employee1 = new Employee('Subordinate Employee 1', '2020-09-04', 50000);
    const employee2 = new Employee('Subordinate Employee 2', '2021-03-04', 50000);
    controller.createManagerSubordinate('Emily Brown', employee1);
    controller.createManagerSubordinate('Emily Brown', employee2);

    const calculatedSalary = controller.calculateSalary('Emily Brown', currentDateStr);

    expect(calculatedSalary).toBeCloseTo(63787.5);
  });
});

describe('Employee class', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });
  it('should calculate salary correctly for Employee instance', () => {
    const currentDateStr = '2023-08-31';
    const employee = new Employee('Alice Johnson', '2020-02-04', 30000);
    controller.createEmployee(employee)

    const calculatedSalary = controller.calculateSalary('Alice Johnson', currentDateStr)

    expect(calculatedSalary).toBeCloseTo(32700);
  });
});
describe('Total calculate', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });
  it('calculates total salary staff member salary without subordinates', () => {
    const sales = new Sales('Jane Smith', '2020-02-04', 60000);
    const manager = new Manager('Emily Brown', '2020-02-04', 55000);
    const employee = new Employee('Subordinate Employee 1', '2020-09-04', 50000);

    controller.createSales(sales)
    controller.createManager(manager)
    controller.createEmployee(employee)


    const totalSalary = controller.calculateTotalSalary('2023-08-31').reduce((sum, salary) => sum + salary.salary, 0)

    expect(totalSalary).toBeCloseTo(179550);
  })
  it('calculates total salary staff member with subordinates', () => {

    const sales = new Sales('Jane Smith', '2020-02-04', 60000);
    controller.createSales(sales)

    const managerSales  = new Manager('Emily Brown', '2020-02-04', 55000);
    controller.createSalesSubordinate('Jane Smith', "Manager", managerSales)

    const employeeSales = new Employee('Subordinate Employee 1', '2020-09-04', 50000);
    controller.createSalesSubordinate('Jane Smith', "Employee", employeeSales)

    const manager = new Manager('Emily Brown', '2020-02-04', 55000);
    controller.createManager(manager)

    const employeeManager = new Employee('Subordinate Employee 1', '2020-09-04', 50000);
    controller.createManagerSubordinate('Jane Smith',  employeeManager)

    const employee = new Employee('Subordinate Employee 1', '2020-09-04', 50000);
    controller.createEmployee(employee)

    const totalSalary = controller.calculateTotalSalary('2023-08-31').reduce((sum, salary) => sum + salary.salary, 0)

    expect(totalSalary).toBeCloseTo(352153.25)
  })
});
