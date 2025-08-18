import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UpdateRulesDto } from './dto/update-rules.dto';
import { AdminApiKeyGuard } from '../common/guards/api-key.guard';
import { AdminService } from './admin.service';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('admin')
@ApiHeader({ name: 'x-api-key', required: true })
@Controller('admin')
@UseGuards(AdminApiKeyGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Put('rules')
  @ApiOperation({ summary: 'Update business rules and activate new version' })
  @ApiOkResponse({
    schema: {
      properties: {
        version: { type: 'string' },
        isActive: { type: 'boolean' },
      },
    },
  })
  async updateRules(@Body() dto: UpdateRulesDto) {
    const payload = plainToInstance(UpdateRulesDto, dto);
    await validateOrReject(payload);
    const res = await this.adminService.updateRules(payload);
    return res;
  }

  @Get('rules')
  @ApiOperation({ summary: 'Retrieve current active business rules' })
  @ApiOkResponse({
    schema: {
      properties: {
        version: { type: 'string', nullable: true },
        rules: { type: 'array', items: { type: 'object' } },
      },
    },
  })
  async getActiveRules() {
    return this.adminService.getActiveRules();
  }

  @Get('rules/history')
  @ApiOperation({ summary: 'Retrieve rule change history' })
  @ApiOkResponse({ schema: { type: 'array', items: { type: 'object' } } })
  async getHistory() {
    return this.adminService.getRuleHistory();
  }
}
