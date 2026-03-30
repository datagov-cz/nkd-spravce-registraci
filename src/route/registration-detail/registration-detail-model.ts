import { HeaderBrandingState, HeaderNavigationState } from "../../components";
import { RegistrationSource, RegistrationType } from "../../registration";

export interface RegistrationDetailGetState {

  branding: HeaderBrandingState;

  navigation: HeaderNavigationState;

  registrationLabel: string;

  registrationSource: RegistrationSource;

  registrationType: RegistrationType;

  attachmentContent: string;

  registrationListUrl: string;

}
