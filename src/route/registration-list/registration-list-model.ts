import { LayoutState } from "../../components";
import { RegistrationSource, RegistrationType } from "../../registration";

export interface RegistrationListGetState {

  layout: LayoutState;

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
