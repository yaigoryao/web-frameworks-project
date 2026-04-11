import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { CustomerCarService } from "../../../services/car-service/customers/customers-car.service";
import { CarDto } from "@monorepo/shared";
import { CustomerGetCarQuery } from "../../../repositoires/car-repository/queries/customer-get-car.query";
import { Request } from 'express';
import '../../../common/extensions/request.extension';
import { Routes } from "../../../common/routes/routes";
import { ApiResponse, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags(Routes.Customer.Car)
@Controller(Routes.Customer.Car)
export class CustomerCarController {
    constructor(private readonly customerCarService: CustomerCarService) { }

    @ApiOperation({ summary: 'Автомобили текущего пользователя (JWT); чужой userId из query недоступен' })
    @ApiResponse({ status: 200, description: 'List of cars', type: CarDto, isArray: true })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard)
    async getCars(@Query() query: CustomerGetCarQuery, @Req() req: Request): Promise<(CarDto | null)[]> {
        return await this.customerCarService.getCars(query, req.login || '');
    }
}
