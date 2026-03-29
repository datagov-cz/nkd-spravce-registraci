import { VNode } from "preact";
import { RouteService } from "../route";
import { AuthenticationData } from "../authentication";

export function createLayoutState(
  route: RouteService,
  user: AuthenticationData,
): LayoutState {
  return {
    userName: `${user.familyName} ${user.givenName}`,
    organizationName: user.entity.name,
    listRegistrationUrl: route.listRegistration(),
    createRegistrationUrl: route.createRegistration(),
    logoutUrl: route.caaisLogout(),
  }
}

export interface LayoutState {

  userName: string;

  organizationName: string;

  listRegistrationUrl: string;

  createRegistrationActive?: boolean;

  createRegistrationUrl: string;

  listRegistrationActive?: boolean;

  logoutUrl: string;

}


export function Layout(props: {
  children: VNode<any> | VNode<any>[],
  language: string;
  title: string;
  state: LayoutState,
}) {
  const children = asArray(props.children);
  const state = props.state;
  return (
    <html lang={props.language}>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>{props.title}</title>
        <link rel="stylesheet" href="https://data.gov.cz/assets/design-system/assets/styles/critical.css" />
        <link rel="stylesheet" href="https://data.gov.cz/assets/design-system/assets/fonts/roboto.css" />
        <link rel="stylesheet" href="https://data.gov.cz/assets/design-system/build/core.css" />
        <link rel="stylesheet" href="./assets/css/style.css" />
        <script src="./assets/javascript/design-system.js" />
        <script type="module" src="https://data.gov.cz/assets/design-system/build/core.esm.js" />
        <script nomodule src="https://data.gov.cz/assets/design-system/build/core.js" />
      </head>
      <body>
        <header class="gov-header">
          <gov-container>
            <gov-branding>
              <h1 class="heading">
                Správce registrací národního katalogu dat
              </h1>
              <div style="align-items: center;">
                <div>
                  {state.userName}
                  <br />
                  {state.organizationName}
                </div>
                <a href={state.logoutUrl} style={{ color: "var(--gov-nav-color, var(--gov-color-neutral-white))" }}>
                  Odhlásit
                </a>
              </div>
            </gov-branding>
            <gov-nav wcag-label="Hlavní navigace">
              <gov-nav-item
                href={state.createRegistrationUrl}
                className={active(state.createRegistrationActive)}
              >
                Vložení registračního záznamu
              </gov-nav-item>
              <gov-nav-item
                href={state.listRegistrationUrl}
                className={active(state.listRegistrationActive)}
              >
                Přehled registračních záznamů
              </gov-nav-item>
            </gov-nav>
          </gov-container>
        </header>
        <gov-container>
          {children}
        </gov-container>
      </body>
    </html>
  )
}

function asArray<Type>(value: Type | Type[]): Type[] {
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}

function active(value?: boolean): string {
  if (value === true) {
    return "active";
  }
  return "";
}
