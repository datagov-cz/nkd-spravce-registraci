import { VNode } from "preact";

export function Layout(props: {
  children: VNode<any> | VNode<any>[],
  language: string;
  title: string;
}) {
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
        {props.children}
      </body>
    </html>
  )
}
