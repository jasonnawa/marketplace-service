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
    ApiBadRequestResponse({ description: 'Bad Request', type: ErrorResponseDto }),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: 'Not Found', type: ErrorResponseDto }),
  );
};
