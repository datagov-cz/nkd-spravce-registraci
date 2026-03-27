import { VNode } from "preact";

export function HtmlLayout(props: {
  children: VNode<any> | VNode<any>[],
  language: string,
  title: string,
  user: { name: string, logout: string },
  organization: { name: string },
}) {
  const children = asArray(props.children);
  return (
    <html lang={props.language}>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>{props.title}</title>
        <link rel="stylesheet" href="https://data.gov.cz/assets/design-system/assets/styles/critical.css" />
        <link rel="stylesheet" href="https://data.gov.cz/assets/design-system/assets/fonts/roboto.css" />
        <link rel="stylesheet" href="https://data.gov.cz/assets/design-system/build/core.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <script src="assets/javascript/design-system.js" />
        <script type="module" src="https://data.gov.cz/assets/design-system/build/core.esm.js" />
        <script nomodule src="https://data.gov.cz/assets/design-system/build/core.js" />
      </head>

      <body>
        <header class="gov-header">
          <gov-container>
            <gov-branding>
              <h1 class="heading">Správce registrací národního katalogu dat</h1>
              <div style="align-items: center;">
                <div>
                  {props.user.name}
                  <br />
                  {props.organization.name}
                </div>
                <a href={props.user.logout} style={{ color: "var(--gov-nav-color, var(--gov-color-neutral-white))" }}>Odhlásit</a>
              </div>
            </gov-branding>
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