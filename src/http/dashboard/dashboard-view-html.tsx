import { renderToHtml, HtmlLayout } from "../html";
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
        <h2>Registrační záznamy</h2>
        {messages.map(item => (
          <li>
            <a href={"./detail-registrace?id=" + encodeURIComponent(item.identifier)}>{item.label}</a> <br/>
            Identifikátor záznamu: {item.identifier} <br/>
            Záznam vytvořen: {item.createdAt.toISOString()} <br/>
            Druh záznamu: {item.type}
          </li>
        ))}
      </section>
      <section>
        <h2>Vložení nového záznamu</h2>
        <form method="post" enctype="multipart/form-data">
          <label for="file">Soubor záznamu:</label>
          <input type="file" id="file" name="file" />
          <button type="submit">Vložit záznam</button>
        </form>
      </section>
    </HtmlLayout>
  )
}

/*
<section>
  <h2>Registrované datové katalogy</h2>
  <ul>
    {catalogs.map(item => (
      <li>
        {item.url}
        {item.endpointUrl}
        {item.homepageUrl}
        <div>
          <gov-button variant="secondary" size="s" href={"./formulář/registrace-datového-katalogu?returnUrl=./registrace-datového-katalogu&datová-sada=" + item.url}>
            <gov-icon slot="left-icon" name="pencil-square"></gov-icon>
          </gov-button>

          <gov-button variant="error" size="s" href={"./formulář/smazání-datového-katalogu?returnUrl=./smazání-datového-katalogu&datová-sada=" + item.url}>
            <gov-icon slot="left-icon" name="trash"></gov-icon>
          </gov-button>
        </div>
      </li>
    ))}
  </ul>
  <br/>
  <div>
    <gov-button variant="primary" href="https://data.gov.cz/formulář/registrace-lokálního-katalogu?returnUrl=http://127.0.0.1:9000/registrace-katalogu">
      <gov-icon slot="left-icon" name="plus-lg"></gov-icon>
      Registruj nový datový catalog
    </gov-button>
  </div>
</section>
<section>
  <h2>Registrované datové sady</h2>
  <ul>
    {datasets.map(item => (
      <li>
        <a href={item.url} target="_blank">{item.title}</a>

        <div>
          <gov-button variant="secondary" size="s">
            <gov-icon slot="left-icon" name="pencil-square"></gov-icon>
          </gov-button>

          <gov-button variant="error" size="s">
            <gov-icon slot="left-icon" name="trash"></gov-icon>
          </gov-button>
        </div>
      </li>
    ))}
  </ul>
  <br/>
  <div>
    <gov-button variant="primary" href="https://data.gov.cz/formulář/registrace-datové-sady?returnUrl=http://127.0.0.1:9000/registrace-datové-sady">
      <gov-icon slot="left-icon" name="plus-lg"></gov-icon>
      Registruj novou datovou sadu
    </gov-button>
  </div>
</section>
*/
