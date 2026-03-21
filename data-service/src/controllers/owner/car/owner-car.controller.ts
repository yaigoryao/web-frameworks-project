import { Controller, Get, Post, Put, Query, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { OwnerGuard } from "../../../guards/owner-guard/owner.guard";
import { OwnerCarService } from "../../../services/car-service/owner/owner-car.service";
import { CarDto } from "@monorepo/shared";
import { CarAddStatus, CarUpdateStatus } from "../../../repositoires/car-repository/car.repository";
import { GetCarQuery } from "../../../repositoires/car-repository/queries/get-car.query";
import { AddCarCommand } from "../../../repositoires/car-repository/commands/add-car.command";
import { UpdateCarCommand } from "../../../repositoires/car-repository/commands/update-car.command";
import '../../../common/extensions/request.extension';
import { Routes } from "../../../common/routes/routes";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from "@nestjs/swagger";

@ApiTags(Routes.Owner.Car)
@Controller(Routes.Owner.Car)
export class OwnerCarController {
    constructor(private readonly ownerCarService: OwnerCarService) { }

    @ApiOperation({ summary: 'Get owner cars' })
    @ApiResponse({ status: 200, description: 'List of owner cars', type: CarDto, isArray: true })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Owner only' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard, OwnerGuard)
    async getCars(@Query() query: GetCarQuery): Promise<(CarDto | null)[]> {
        return await this.ownerCarService.getCars(query);
    }
}
