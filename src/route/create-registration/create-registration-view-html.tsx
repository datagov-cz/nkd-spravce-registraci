import { HeaderBranding, HeaderNavigation, Layout } from "../../components";
import { renderToHtml } from "../../html";
import { CreateRegistrationGetState } from "./create-registration-model";

export function renderCreateRegistrationGetViewHtml(
  state: CreateRegistrationGetState,
) {
  return renderToHtml(<CreateRegistrationGetViewHtml state={state} />, false);
}

function CreateRegistrationGetViewHtml(
  { state }: { state: CreateRegistrationGetState },
) {
  return (
    <Layout language="cs" title="Vložení registračního záznamu">
      <header class="gov-header">
        <gov-container>
          <HeaderBranding state={state.branding} />
          <HeaderNavigation state={state.navigation} />
        </gov-container>
      </header>
      <gov-container>
        <h2>Vložení nového registračního záznamu</h2>
        <div class="flex flex-col" style="gap: 1.0em;" >
          <p>
            Zde můžete vkládat registrační záznamy do NKOD místo jejich zasílání přes datovou schránku.
            Zbytek funkcionality pro správu záznamů zůstává stejný.
            Změny se projeví v NKOD po jeho pravidelném zpracování, které typicky probíhá v nočních hodinách.
          </p>
        </div>
        <gov-tiles columns="2">
          <gov-tile href={state.datasetRegistrationUrl}>
            <h3 slot="title">Registrace nové datové sady formulářem</h3>
            <p>
              Otevře formulář pro vyplnění záznamu pro registraci nové datové sady.
              Po jeho dokončení je záznam zaevidován.
            </p>
          </gov-tile>
          <gov-tile href={state.catalogRegistrationUrl}>
            <h3 slot="title">Registrace nového lokálního katalogu formulářem</h3>
            <p>
              Otevře formulář pro vyplnění záznamu pro registraci nového lokálního katalogu.
              Po jeho dokončení je záznam zaevidován.
            </p>
          </gov-tile>
        </gov-tiles>
        <br />
        <hr />
        <br />
        {/* We do not use gov-tile as the content is not interactive. */}
        <section style="padding: 0 1.5rem 1.5rem 1.5rem">
          <div>
            <span class="gov-tile__title">
              <h3 slot="title">Registrační záznam ze souboru</h3>
            </span>
            <div>
              <form method="post"
                action={state.registrationUploadUrl}
                enctype="multipart/form-data"
              >
                <div class="flex flex-col" style="gap: 1.0em;" >
                  <label for="file">Záznamy lze vkládat i ze souborů. Soubory získáte vyplněním příslušných formulářů NKOD pro editaci či smazání datové sady či katalogu. Lze použít i pro nahrání ručně připravených záznamů pro novou datovou sadu či katalog.</label>
                  <input type="file" id="file" name="file" accept="text/plain, .jsonld, .json" required />
                </div>
                <br />
                <gov-button variant="primary" type="outlined" native-type="submit">
                  Vložit záznam
                </gov-button>
              </form>
            </div>
          </div>
        </section>
      </gov-container>
    </Layout >
  )
}
