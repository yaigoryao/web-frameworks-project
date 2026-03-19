import { Controller, Get, Post, Put, Query, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { RolesGuard } from "../../../guards/role-guard/role.guard";
import { ManagersCarService } from "../../../services/car-service/managers/managers-car.service";
import { CarDto } from "@monorepo/shared";
import { CarAddStatus, CarUpdateStatus } from "../../../repositoires/car-repository/car.repository";
import { GetCarQuery } from "../../../repositoires/car-repository/queries/get-car.query";
import { AddCarCommand } from "../../../repositoires/car-repository/commands/add-car.command";
import { UpdateCarCommand } from "../../../repositoires/car-repository/commands/update-car.command";
import '../../../common/extensions/request.extension';

@Controller('manager/car')
export class ManagersCarController {
    constructor(private readonly managersCarService: ManagersCarService) { }

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    async getCars(@Query() query: GetCarQuery): Promise<(CarDto | null)[]> {
        return await this.managersCarService.getCars(query);
    }

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    async addCar(@Body() request: AddCarCommand): Promise<CarAddStatus> {
        return await this.managersCarService.addCar(request);
    }

    @Put()
    @UseGuards(AuthGuard, RolesGuard)
    async updateCar(@Body() request: UpdateCarCommand): Promise<CarUpdateStatus> {
        return await this.managersCarService.updateCar(request);
    }
}
