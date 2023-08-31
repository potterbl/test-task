import { Module } from '@nestjs/common';
import {CompanyController} from "./company.controller";
import {Employee} from "./schemas/employee.schema";
import {Sales} from "./schemas/sales.schema";
import {Manager} from "./schemas/manager.schema";

@Module({
    imports: [
    ],
    controllers: [CompanyController],
    providers: [Sales, Manager, Employee],
})
export class CompanyModule {}
