import { LayoutState } from "../../components";
import { RegistrationSource, RegistrationType } from "../../registration";

export interface RegistrationDetailGetState {

  layout: LayoutState;

  registrationLabel: string;

  registrationSource: RegistrationSource;

  registrationType: RegistrationType;

  attachmentContent: string;

  registrationListUrl: string;

}
