import { HeaderBranding, HeaderNavigation, Layout } from "../../components";
import { renderToHtml } from "../../html";
import { MessageItem, RegistrationListGetState } from "./registration-list-model";

export function renderRegistrationListGetViewHtml(
  state: RegistrationListGetState,
) {
  return renderToHtml(<RegistrationListGetViewHtml state={state} />);
}

function RegistrationListGetViewHtml(
  { state }: { state: RegistrationListGetState },
) {
  const { messages } = state;
  return (
    <Layout language="cs" title="Přehled registrací">
      <header class="gov-header">
        <gov-container>
          <HeaderBranding state={state.branding} />
          <HeaderNavigation state={state.navigation} />
        </gov-container>
      </header>
      <gov-container>
        <h2>Přehled registračních záznamů</h2>
        <ul class="registrations-list">
          {messages.sort(dateDescending).map(item => (
            <li>
              <a href={item.detailUrl}>{item.label}</a> <br />
              Záznam vytvořen v
              <time datetime={item.createdAt.toISOString()}>
                {item.createdAt.toLocaleString("cs-CZ", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </time>
            </li>
          ))}
        </ul>
      </gov-container>
    </Layout>
  )
}

function dateDescending(left: MessageItem, right: MessageItem) {
  return right.createdAt.getTime() - left.createdAt.getTime();
}

/*
<gov-tiles>
  <gov-tile href="#">
    <h3 slot="title">
      <gov-icon name="envelope" type="complex" slot="icon"></gov-icon> // For ISDS only
      Zdroje energie, těžba, nerosty, drahé kovy
    </h3>
    <p>
      Secondary - Od 20. 12. 2020 do 14:00 h do 20.&nbsp;12. 2020 do 15:00 h bude provedena plánovaná odstávka serverů.
      V&nbsp;uvedeném termínu bude nedostupné přihlášení k&nbsp;Portálu občana prostřednictvím datové schránky.
      Více informací <a href="#">zde</a>.
    </p>
  </gov-tile>
</gov-tiles>
*/