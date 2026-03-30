import { HeaderBrandingState, HeaderNavigationState } from "../../components";

export interface CreateRegistrationGetState {

  branding: HeaderBrandingState;

  navigation: HeaderNavigationState;

  datasetRegistrationUrl: string;

  catalogRegistrationUrl: string;

  registrationUploadUrl: string;

}
