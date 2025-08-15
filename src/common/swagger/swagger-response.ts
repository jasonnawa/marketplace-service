// api-response-wrapper.decorator.ts
import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto';

export const ApiResponseWrapper = <TModel extends Type<any>>(
  model: TModel,
  description = 'Successful response',
) => {
  return applyDecorators(
    ApiExtraModels(model, ErrorResponseDto),
    ApiOkResponse({
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Successful' },
          data: { $ref: getSchemaPath(model) },
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Bad Request',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed: Missing required fields' },
          data: { type: 'object', example: {} },
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Invalid credentials' },
          data: { type: 'object', example: {} },
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'Not Found',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Resource not found' },
          data: { type: 'object', example: {} },
        },
      },
    }),
  );
};
