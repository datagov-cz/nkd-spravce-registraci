import { DiskRepository } from "./disk";
import { IsdsRepository } from "./isds";
import { Registration, RegistrationItem } from "./registration-model";

export function createRegistrationService(
  isds: IsdsRepository,
  disk: DiskRepository,
): RegistrationService {
  return new DefaultRegistrationService(isds, disk);
}

export interface RegistrationService {

  readRegistration(
    organization: string,
    identifier: string,
  ): Promise<Registration | null>;

  /**
   * @returns All entries for given organization.
   */
  listRegistrations(organization: string): RegistrationItem[];

  /**
   * @returns Identifier of the newly created registration entry.
   */
  createRegistration(
    createdAt: number,
    organization: string,
    attachment: string,
  ): Promise<RegistrationItem>

  /**
   * Run synchronize content with storage.
   */
  synchronize(): Promise<void>;

}

class DefaultRegistrationService implements RegistrationService {

  readonly isds: IsdsRepository;

  readonly disk: DiskRepository;

  constructor(isds: IsdsRepository, disk: DiskRepository) {
    this.isds = isds;
    this.disk = disk;
  }

  async readRegistration(
    organization: string, identifier: string,
  ): Promise<Registration | null> {
    return await this.isds.readRegistration(organization, identifier) ??
      await this.disk.readRegistration(organization, identifier) ??
      null;
  }

  listRegistrations(organization: string): RegistrationItem[] {
    return [
      ...this.isds.listRegistrations(organization),
      ...this.disk.listRegistrations(organization),
    ];
  }

  async createRegistration(
    createdAt: number, organization: string, attachment: string,
  ): Promise<RegistrationItem> {
    return this.disk.createRegistration(createdAt, organization, attachment);
  }

  async synchronize(): Promise<void> {
    await Promise.all([this.isds.synchronize(), this.disk.synchronize()]);
  }

}
