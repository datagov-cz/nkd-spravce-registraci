import { RegistrationSource, RegistrationType } from "../../registration";

export interface RegistrationState {

  user: {

    name: string;

    logout: string;

  };

  organization: {

    name: string;

  };

  dashboardUrl: string;

  registration: {

    source: RegistrationSource;

    type: RegistrationType;

  };

  attachment: string;

}
