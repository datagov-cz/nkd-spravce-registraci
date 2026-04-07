import { HeaderBrandingState, HeaderNavigationState } from "../../components";
import { RegistrationSource, RegistrationType } from "../../registration";

export interface PaginationState {

  currentPage: number;

  totalPages: number;

  prevPageUrl: string | null;

  nextPageUrl: string | null;

}

export interface RegistrationListGetState {

  branding: HeaderBrandingState;

  navigation: HeaderNavigationState;

  createRegistrationUrl: string;

  messages: MessageItem[];

  pagination: PaginationState;

}

export interface MessageItem {

  identifier: string;

  label: string;

  source: RegistrationSource;

  type: RegistrationType;

  createdAt: Date;

  detailUrl: string;

}
