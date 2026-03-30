import { HeaderBranding, HeaderNavigation, Layout } from "../../components";
import { renderToHtml } from "../../html";
import { RegistrationDetailGetState } from "./registration-detail-model";

export function renderRegistrationDetailGetViewHtml(
  state: RegistrationDetailGetState,
) {
  return renderToHtml(<RegistrationDetailGetViewHtml state={state} />, false);
}

function RegistrationDetailGetViewHtml(
  { state }: { state: RegistrationDetailGetState },
) {
  return (
    <Layout language="cs" title="Detail registrace">
      <header class="gov-header">
        <gov-container>
          <HeaderBranding state={state.branding} />
          <HeaderNavigation state={state.navigation} />
        </gov-container>
      </header>
      <gov-container>
        <h2>Detail registračního záznamu</h2>
        <code class="registration-detail">
          {state.attachmentContent}
        </code>
        <br />
        <br />
        <a href={state.registrationListUrl}>Zpět na seznam registrací</a>
      </gov-container>
    </Layout>
  )
}
