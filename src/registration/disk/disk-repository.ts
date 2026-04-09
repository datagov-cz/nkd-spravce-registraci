import { randomBytes } from "node:crypto";
import { FileSystemService } from "../../file-system";
import {
  createStatementRdfBuilder,
  createStringN3RdfWriter,
  LanguageString,
} from "../../rdf";
import { parseIsdsAttachment } from "../isds";
import { IsdsAttachment } from "../isds/isds-attachment";
import {
  Registration,
  RegistrationItem,
  RegistrationSource,
} from "../registration-model";
import {
  DiskMessage,
  parseDiskMessage,
  writeDiskMessage,
} from "./disk-message";
import { logger } from "../../application";

export function createDiskRepository(
  fileSystem: FileSystemService,
  messagesPath: string,
  attachmentsPath: string,
): DiskRepository {
  return new DefaultDiskRepository(
    fileSystem, messagesPath, attachmentsPath);
}

export interface DiskRepository {

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
    username: string,
    attachment: string,
  ): Promise<RegistrationItem>

  /**
   * Run synchronize content with storage.
   */
  synchronize(): Promise<void>;

}

class DefaultDiskRepository implements DiskRepository {

  readonly messages: RegistrationItem[] = [];

  readonly identifiers: Set<string> = new Set();

  readonly fileSystem: FileSystemService;

  readonly messagesPath: string;

  readonly attachmentsPath: string;

  constructor(
    fileSystem: FileSystemService,
    messagesPath: string,
    attachmentsPath: string,
  ) {
    this.fileSystem = fileSystem;
    this.messagesPath = messagesPath;
    this.attachmentsPath = attachmentsPath;
  }

  async readRegistration(
    organization: string,
    identifier: string,
  ): Promise<Registration | null> {
    const entry = this.messages.find(item =>
      item.organization === organization && item.identifier === identifier);
    if (entry === undefined) {
      return null;
    }
    return {
      ...entry,
      attachmentContent: await this.fileSystem.readFile(entry.attachmentPath),
    };
  }

  listRegistrations(organization: string): RegistrationItem[] {
    return this.messages.filter(item => item.organization === organization);
  }

  async createRegistration(
    createdAt: number,
    organization: string,
    username: string,
    attachmentContent: string,
  ): Promise<RegistrationItem> {
    const attachment = await parseIsdsAttachment(attachmentContent);
    if (attachment === null) {
      throw new Error("Invalid attachment.");
    }
    //
    const identifier = this.createIdentifier();
    const attachmentFileName = identifier + ".jsonld";
    // Write attachment
    const attachmentPath = this.attachmentsPath + "/" + attachmentFileName;
    await this.fileSystem.writeFile(attachmentPath, attachmentContent);
    // Prepare message
    const message: DiskMessage = {
      identifier,
      organization,
      username,
      createdAt: new Date(createdAt),
      attachmentFileName,
    };
    const builder = createStatementRdfBuilder();
    writeDiskMessage(builder, message);
    const writer = createStringN3RdfWriter({
      prefixes: { nkod: "https://data.gov.cz/slovník/nkod/" },
      pretty: true,
    });
    writer.addStatements(builder.build());
    const messageContent = await writer.asString();
    // Write message
    const messagePath = this.messagesPath + "/" + identifier + ".ttl";
    this.fileSystem.writeFile(messagePath, messageContent);
    // Crete, store, and return message.
    const entry = createRegistrationEntry(
      this.attachmentsPath, message, attachment);
    this.messages.push(entry);
    return entry;
  }

  private createIdentifier(): string {
    let identifier: string;
    do {
      const hex = randomBytes(4).toString("hex");
      identifier = "00-" + hex.slice(0, 4) + "-" + hex.slice(4, 8);
    } while (this.identifiers.has(identifier));
    this.identifiers.add(identifier);
    return identifier;
  }

  async synchronize(): Promise<void> {
    const files = await this.fileSystem.readDirectory(this.messagesPath);
    for (const messagePath of files) {
      try {
        const message = await this.loadMessage(messagePath);
        // This can be slow once there are many messages.
        this.identifiers.add(message.identifier);
        const index = this.messages.findIndex(
          item => item.identifier === message.identifier);
        if (index === -1) {
          this.messages.push(message);
        } else {
          this.messages[index] = message;
        }
      } catch (error) {
        logger.warn(
          { message: messagePath, error: (error as Error).message },
          "Failed to process a message.");
      }
    }
  }

  private async loadMessage(messagePath: string): Promise<RegistrationItem> {
    // Read message.
    const messageContent = await this.fileSystem.readFile(messagePath);
    const message = await parseDiskMessage(messageContent);
    if (message === null) {
      throw new Error("Message is not valid.");
    }
    // Read attachment.
    const attachmentPath =
      `${this.attachmentsPath}/${message.attachmentFileName}`;
    const attachmentContent = await this.fileSystem.readFile(attachmentPath);
    const attachment = await parseIsdsAttachment(attachmentContent);
    // Validate attachment.
    if (attachment === null) {
      throw new Error("Attachment is not valid.");
    }
    return createRegistrationEntry(this.attachmentsPath, message, attachment);
  }
}

function createRegistrationEntry(
  attachmentsPath: string,
  message: DiskMessage,
  attachment: IsdsAttachment,
): RegistrationItem {
  // Prepare label.
  let label: LanguageString = {};
  if (attachment.label === null) {
    if (attachment.iri === null) {
      // We have nothing to show.
    } else {
      label = { "": attachment.iri };
    }
  } else {
    label = attachment.label;
  }
  //
  return {
    identifier: message.identifier,
    organization: message.organization,
    createdAt: message.createdAt,
    source: RegistrationSource.RegistrationManager,
    type: attachment.type,
    label,
    attachmentPath: attachmentsPath + "/" + message.attachmentFileName,
  }
}
