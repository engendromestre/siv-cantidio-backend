import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import EventEmitter2 from 'eventemitter2';

@ApiExcludeController()
@Controller('fake-event')
export class FakeController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Get()
  dispatchEvent() {
    this.eventEmitter.emit('test', { data: 'dados dos eventos' });
    return { ok: true };
  }
}
