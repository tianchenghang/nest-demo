import { SetMetadata } from '@nestjs/common';

export const Whitelist = (...args: string[]) => SetMetadata('whitelist', args);
