/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    Body, Controller, Delete, Get, Params, Post, Request, Response,
} from '@decorators/express';
import { SwaggerTags } from '@trapi/swagger';
import { Robot } from '@authelion/common';
import { ForceLoggedInMiddleware } from '../../middleware';
import {
    createRobotRouteHandler,
    deleteRobotRouteHandler,
    getManyRobotRouteHandler,
    getOneRobotRouteHandler,
    updateRobotRouteHandler,
} from './handlers';

@SwaggerTags('robot')
@Controller('/robots')
export class RobotController {
    @Get('', [ForceLoggedInMiddleware])
    async getMany(
        @Request() req: any,
            @Response() res: any,
    ): Promise<Robot[]> {
        return getManyRobotRouteHandler(req, res);
    }

    @Post('', [ForceLoggedInMiddleware])
    async add(
        @Body() data: Robot,
            @Request() req: any,
            @Response() res: any,
    ): Promise<Robot> {
        return createRobotRouteHandler(req, res);
    }

    @Get('/:id', [ForceLoggedInMiddleware])
    async getOne(
        @Params('id') id: string,
            @Request() req: any,
            @Response() res: any,
    ): Promise<Robot> {
        return getOneRobotRouteHandler(req, res);
    }

    @Post('/:id', [ForceLoggedInMiddleware])
    async edit(
        @Params('id') id: string,
            @Body() data: Pick<Robot, 'name'>,
            @Request() req: any,
            @Response() res: any,
    ): Promise<Robot> {
        return updateRobotRouteHandler(req, res);
    }

    @Delete('/:id', [ForceLoggedInMiddleware])
    async drop(
        @Params('id') id: string,
            @Request() req: any,
            @Response() res: any,
    ): Promise<Robot> {
        return deleteRobotRouteHandler(req, res);
    }
}
