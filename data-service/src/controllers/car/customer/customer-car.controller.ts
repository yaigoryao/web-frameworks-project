import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { CustomerCarService } from "../../../services/car-service/customers/customers-car.service";
import { CarDto } from "@monorepo/shared";
import { GetCarQuery } from "../../../repositoires/car-repository/queries/get-car.query";
import '../../../common/extensions/request.extension';

@Controller('customer/car')
export class CustomerCarController {
    constructor(private readonly customerCarService: CustomerCarService) { }

    @Get()
    @UseGuards(AuthGuard)
    async getCars(@Query() query: GetCarQuery): Promise<(CarDto | null)[]> {
        return await this.customerCarService.getCars(query);
    }
}
