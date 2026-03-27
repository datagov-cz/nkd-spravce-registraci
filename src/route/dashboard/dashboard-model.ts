import { RegistrationSource, RegistrationType } from "../../registration";

export interface DashboardState {

  user : {

    name: string;

    logout: string;

  };

  organization: {

    name: string;

  };

  datasetRegistrationUrl: string;

  catalogRegistrationUrl: string;

  registrationUploadUrl: string;

  messages: MessageItem[];

}


export interface MessageItem {

  identifier: string;

  label: string;

  source: RegistrationSource;

  type: RegistrationType;

  createdAt: Date;

  detailUrl: string;

}
