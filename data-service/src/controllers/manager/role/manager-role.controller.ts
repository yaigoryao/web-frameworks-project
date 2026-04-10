import { CustomerUpdateUserRequest, IError, Role, RoleDto, splitErrorMessage } from "@monorepo/shared";
import { Body, Controller, Get, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { CustomerUserService } from "../../../services/user-service/customers/customers-user.service";
import { Request } from 'express';
import { Constants } from "../../../common/constants/constants";
import '../../../common/extensions/request.extension';
import { GetRoleQuery } from "../../../repositoires/role-repository/queries/get-role.query";
import { RoleRepository } from "../../../repositoires/role-repository/role.repository";
import { RolesGuard } from "../../../guards/role-guard/role.guard";
import { MapperService } from "../../../services/mapper-service/mapper.service";
import { Routes } from "../../../common/routes/routes";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from "@nestjs/swagger";

@ApiTags(Routes.Manager.Role)
@Controller(Routes.Manager.Role)
export class ManagersRoleController {
    constructor(private readonly roleRepository: RoleRepository,
        private readonly mapper: MapperService
    ) {
    }

    @ApiOperation({ summary: 'Get all roles' })
    @ApiResponse({ status: 200, description: 'List of roles', type: RoleDto, isArray: true })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    async getUserInfo(@Query() query: GetRoleQuery): Promise<{ roles: RoleDto[]; total: number }> {
        const { roles, total } = await this.roleRepository.getRoles(query);
        return {
            roles: this.mapper.toDtos<Role, RoleDto>(roles).filter((role): role is RoleDto => role !== null),
            total
        };
    }
}

