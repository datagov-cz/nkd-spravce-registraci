import { HeaderBrandingState, HeaderNavigationState } from "../../components";
import { RegistrationSource, RegistrationType } from "../../registration";

export interface RegistrationListGetState {

  branding: HeaderBrandingState;

  navigation: HeaderNavigationState;

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
