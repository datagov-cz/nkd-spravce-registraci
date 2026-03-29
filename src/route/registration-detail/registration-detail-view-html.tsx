import { Layout } from "../../components";
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
    <Layout
      language="cs"
      title="Detail registrace"
      state={state.layout}
    >
      <h2>
        Detail registračního záznamu
        {/*
          &nbsp;
          <gov-tooltip message="Stažení registračního záznamu">
            <gov-button variant="secondary" type="link">
              <gov-icon name="download"></gov-icon>
            </gov-button>
          </gov-tooltip>
          */}
      </h2>
      <code class="registration-detail">
        {state.attachmentContent}
      </code>
      <br />
      <br />
      <a href={state.registrationListUrl}>Zpět na seznam registrací</a>
    </Layout>
  )
}
