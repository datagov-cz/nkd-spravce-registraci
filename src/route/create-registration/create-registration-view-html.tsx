import { Layout } from "../../components";
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
    <Layout
      language="cs"
      title="Vložení registračního záznamu"
      state={state.layout}
    >
      <h2>Vložení registračního záznamu</h2>
      <gov-tiles columns="2">
        <gov-tile href={state.datasetRegistrationUrl}>
          <h3 slot="title">Registrace datové sady</h3>
          <p>
            Registrace nové datové sady.
          </p>
        </gov-tile>
        <gov-tile href={state.catalogRegistrationUrl}>
          <h3 slot="title">Registrace datového katalogu</h3>
          <p>
            Registrace nového datového katalogu sady.
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
            <h3 slot="title">Vložení registračního záznamu ze souboru</h3>
          </span>
          <div>
            <form method="post"
              action={state.registrationUploadUrl}
              enctype="multipart/form-data"
            >
              {/*
              <gov-form-control>
                <gov-form-label size="s" slot="top">
                  Nahrát registrační záznam
                </gov-form-label>
                <gov-form-group>
                  <gov-form-file accept="text/plain,.jsonld,.json" name="file" multiple required expanded>
                    <p>
                      Přetáhněte soubor nebo
                    </p>
                    <p>
                      <gov-button variant="primary" type="outlined">
                        Nahrajte ze zařízení
                      </gov-button>
                    </p>
                    <p class="gov-text--s"> Podporované formáty ... </p>
                  </gov-form-file>
                </gov-form-group>
              </gov-form-control>
              */}
              <div class="flex flex-col" style="gap: 1.0em;" >
                <label for="file">Vyberte soubor registračního záznamu</label>
                <input type="file" id="file" name="file" accept="text/plain, .jsonld, .json" required/>
              </div>
              <br/>
              <gov-button variant="primary" type="outlined" native-type="submit">
                Vložit záznam
              </gov-button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  )
}
