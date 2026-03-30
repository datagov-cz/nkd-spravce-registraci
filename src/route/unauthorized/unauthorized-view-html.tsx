import { HeaderBranding, Layout } from "../../components";
import { renderToHtml } from "../../html";
import { UnauthorizedState } from "./unauthorized-state";

export function renderUnauthorizedViewHtml(state: UnauthorizedState) {
  return renderToHtml(<UnauthorizedViewHtml state={state} />);
}

function UnauthorizedViewHtml({ state }: {
  state: UnauthorizedState,
}) {
  return (
    <Layout language="cs" title="Nedostatečné oprávnění">
      <header class="gov-header">
        <gov-container>
          <HeaderBranding state={state.branding} />
        </gov-container>
      </header>
      <gov-container>
        <h2>Nedostatečné oprávnění</h2>
        <p>
          Nemáte oprávnění pracovat s touto aplikací.
        </p>
      </gov-container>
    </Layout>
  )
}
