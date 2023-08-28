import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DriverService } from '../../drivers/drivers.service';

@Injectable()
export class DriverRoleGuard implements CanActivate {
  constructor(private readonly driverService: DriverService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.checkIfDriver(request);
  }

  async checkIfDriver(request) {
    const driver = await this.driverService.driverExist(request.user.id);
    if (driver) {
      return true;
    } else {
      false;
    }
  }
}
