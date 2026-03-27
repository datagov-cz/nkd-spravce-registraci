
export interface Registration extends RegistrationItem {

  /**
   * Content of the attachment.
   */
  attachmentContent: string;

}

export interface RegistrationItem {

  identifier: string;

  /**
   * Where is the registration record from.
   */
  source: RegistrationSource;

  type: RegistrationType;

  /**
   * When was the entry created in the system.
   */
  createdAt: Date;

  /**
   * Not every databox is mapped to an organization.
   */
  organization: string;

  label: { [language: string]: string };

  /**
   * Content of an attachment file as JSON-LD.
   */
  attachmentPath: string;

}

export enum RegistrationSource {
  ISDS = "isds",
  RegistrationManager = "registration-manager",
}

export enum RegistrationType {
  CreateDataset = "create-dataset",
  WithdrawDataset = "withdraw-dataset",
  CreateCatalog = "create-catalog",
  WithdrawCatalog = "withdraw-catalog",
}
