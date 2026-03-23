import { renderToHtml, HtmlLayout } from "../html";
import { type RegistrationState } from "./registration-model";

export function renderRegistrationViewHtml(state: RegistrationState) {
  return renderToHtml(<HomeView state={state} />, false);
}

function HomeView({ state }: { state: RegistrationState }) {
  return (
    <HtmlLayout
      language="cs"
      title="Přehled registrací"
      user={state.user}
      organization={state.organization}
    >
      <section>
        <h2>Detail registračního záznamu</h2>
        <pre><code>{state.attachment}</code></pre>
      </section>
    </HtmlLayout>
  )
}
