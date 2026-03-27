import { renderToHtml, HtmlLayout } from "../../html";
import { type DashboardState } from "./dashboard-model";

export function renderDashboardViewHtml(state: DashboardState) {
  return renderToHtml(<HomeView state={state} />);
}

function HomeView({ state }: { state: DashboardState }) {
  const { messages } = state;
  return (
    <HtmlLayout
      language="cs"
      title="Přehled registrací"
      user={state.user}
      organization={state.organization}
    >
      <section>
        <h2>Vložení nového záznamu</h2>
        <ul>
          <li>
            <a href={state.datasetRegistrationUrl}>
              Registrace datové sady
            </a>
          </li>
          <li>
            <a href={state.catalogRegistrationUrl}>
              Registrace datového katalogu
            </a>
          </li>
          <li>
            <p>Vložení registračního záznamu ze souboru</p>
            <form method="post"
              action={state.registrationUploadUrl}
              enctype="multipart/form-data"
            >
              <label for="file">Soubor záznamu:</label>
              <input type="file" id="file" name="file" />
              <br />
              <button type="submit">Vložit záznam</button>
            </form>
          </li>
        </ul>
      </section>
      <section>
        <h2>Registrační záznamy</h2>
        <ul>
          {messages.map(item => (
            <li>
              <a href={item.detailUrl}>{item.label}</a> <br />
              Identifikátor záznamu: {item.identifier} <br />
              Záznam vytvořen: {item.createdAt.toISOString()} <br />
              Druh záznamu: {item.type}
            </li>
          ))}
        </ul>
      </section>
    </HtmlLayout>
  )
}
