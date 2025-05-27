import { UserImageRepository } from 'adapter/persistence/repository/UserImageRepository';
import { Inject, Service } from 'typedi';

@Service()
export class UserImageService {
  @Inject()
  private userImageRepository: UserImageRepository;

  async getUserImage(userGuid: string) {
    return this.userImageRepository.findImageByUserGuid(userGuid);
  }
}
