import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { CustomerCarService } from "../../../services/car-service/customers/customers-car.service";
import { CarDto } from "@monorepo/shared";
import { GetCarQuery } from "../../../repositoires/car-repository/queries/get-car.query";
import '../../../common/extensions/request.extension';
import { Routes } from "../../../common/routes/routes";
import { ApiResponse, ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";

@ApiTags(Routes.Customer.Car)
@Controller(Routes.Customer.Car)
export class CustomerCarController {
    constructor(private readonly customerCarService: CustomerCarService) { }

    @ApiOperation({ summary: 'Get all cars available for customer' })
    @ApiResponse({ status: 200, description: 'List of cars', type: CarDto, isArray: true })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard)
    async getCars(@Query() query: GetCarQuery): Promise<(CarDto | null)[]> {
        return await this.customerCarService.getCars(query);
    }
}
