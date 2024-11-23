import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtGuard } from "./jwt.guard";
import { userRole } from "../enum/userRole";

@Injectable()
export class CombinedGuard extends JwtGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role === userRole.CLIENT || user.role === userRole.EMPLOYEE) {
      return true;
    }

    throw new UnauthorizedException(
      "You do not have permission to access this resource."
    );
  }
}
