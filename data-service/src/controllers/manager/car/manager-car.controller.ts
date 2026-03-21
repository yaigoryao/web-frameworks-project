import { Controller, Get, Post, Put, Query, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { RolesGuard } from "../../../guards/role-guard/role.guard";
import { ManagersCarService } from "../../../services/car-service/managers/managers-car.service";
import { ApiEnumResponse, CarDto, getEnumDescription } from "@monorepo/shared";
import { CarAddStatus, CarUpdateStatus } from "../../../repositoires/car-repository/car.repository";
import { GetCarQuery } from "../../../repositoires/car-repository/queries/get-car.query";
import { AddCarCommand } from "../../../repositoires/car-repository/commands/add-car.command";
import { UpdateCarCommand } from "../../../repositoires/car-repository/commands/update-car.command";
import '../../../common/extensions/request.extension';
import { Routes } from "../../../common/routes/routes";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags(Routes.Manager.Car)
@Controller(Routes.Manager.Car)
export class ManagersCarController {
    constructor(private readonly managersCarService: ManagersCarService) { }

    @ApiOperation({ summary: 'Get all cars' })
    @ApiResponse({ status: 200, description: 'List of cars', type: CarDto, isArray: true })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    async getCars(@Query() query: GetCarQuery): Promise<(CarDto | null)[]> {
        return await this.managersCarService.getCars(query);
    }

    // @ApiResponse({
    //     status: 201, description: 'Car added successfully', schema: {
    //         type: 'integer',
    //         enum: Object.values(CarAddStatus).filter(v => typeof v === 'number'),
    //         description: getEnumDescription(CarAddStatus, 'Статус добавления машины в базу'),
    //         example: CarAddStatus.Success
    //     }
    // })
    @ApiOperation({ summary: 'Add new car' })
    @ApiBody({ type: AddCarCommand, description: 'Car data to add' })
    @ApiEnumResponse(CarAddStatus, 'Car insertion status', { status: 201 })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    async addCar(@Body() request: AddCarCommand): Promise<CarAddStatus> {
        return await this.managersCarService.addCar(request);
    }

    @ApiOperation({ summary: 'Update car information' })
    @ApiBody({ type: UpdateCarCommand, description: 'Updated car data' })
    @ApiEnumResponse(CarUpdateStatus, 'Car update status', { status: 200 })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBearerAuth()
    @Put()
    @UseGuards(AuthGuard, RolesGuard)
    async updateCar(@Body() request: UpdateCarCommand): Promise<CarUpdateStatus> {
        return await this.managersCarService.updateCar(request);
    }
}
