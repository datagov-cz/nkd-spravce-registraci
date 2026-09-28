import { HeaderBranding, HeaderNavigation,Layout } from "../../components";
import { renderToHtml } from "../../html";
import { Status400State } from "./status-400-model";

export function renderStatus400ViewHtml(state: Status400State) {
  return renderToHtml(<Status400ViewHtml state={state} />);
}

function Status400ViewHtml({ state }: { state: Status400State }) {
  return (
    <Layout language="cs" title="Přehled registrací">
      <header class="gov-header">
        <HeaderBranding state={state.branding} />
        <HeaderNavigation state={state.navigation} />
      </header>
      <gov-container>
        <gov-error-code>
          <gov-icon type="complex" name="card-400" slot="icon"></gov-icon>
          <p>
            Zdá se, že váš požadavek na server nebyl správně formulován.
            Zkontrolujte zadané údaje a zkuste to znovu.
          </p>
          <div slot="headline">
            <h2>Špatný požadavek</h2>
          </div>
          <gov-button color="primary" size="m" type="solid" href={state.actionHref}>
            Zpět na stránku zadání
          </gov-button>
        </gov-error-code>
      </gov-container>
    </Layout>
  );
}
