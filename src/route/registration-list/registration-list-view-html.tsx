import { HeaderBranding, HeaderNavigation, Layout } from "../../components";
import { renderToHtml } from "../../html";
import { MessageItem, PaginationState, RegistrationListGetState } from "./registration-list-model";

export function renderRegistrationListGetViewHtml(
  state: RegistrationListGetState,
) {
  return renderToHtml(<RegistrationListGetViewHtml state={state} />);
}

function RegistrationListGetViewHtml(
  { state }: { state: RegistrationListGetState },
) {
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
        {state.messages.length === 0 && state.pagination.currentPage === 1 ? (
          <EmptyRegistrationList state={state} />
        ) : (
          <>
            <RegistrationList messages={state.messages} />
            <Pagination pagination={state.pagination} />
          </>
        )}
      </gov-container>
    </Layout>
  )
}

function EmptyRegistrationList(
  { state }: { state: RegistrationListGetState },
) {
  return (
    <p>
      Pro vaší organizaci nejsou k dispozici žádné registrační zprávy.
      Registrační záznam můžete přidat přes
      <a href={state.createRegistrationUrl}>vložení registračního záznamu</a>.
    </p>
  )
}

function RegistrationList({ messages }: {
  messages: MessageItem[],
}) {
  return (
    <ul class="registrations-list">
      {messages.map(item => (
        <li>
          <a href={item.detailUrl}>{item.label}</a> <br />
          Záznam vytvořen v
          <time datetime={item.createdAt.toISOString()}>
            {item.createdAt.toLocaleString("cs-CZ", {
              dateStyle: "full",
              timeStyle: "short",
              timeZone: "Europe/Prague",
            })}
          </time>
        </li>
      ))}
    </ul>
  );
}

function Pagination({ pagination }: { pagination: PaginationState }) {
  if (pagination.totalRecords < pagination.pageSize) {
    return null;
  }
  return (
    <nav aria-label="Stránkování">
      <gov-pagination
        total={String(pagination.totalRecords)}
        current={String(pagination.currentPage)}
        page-size={pagination.pageSize}
        wcag-label="Stránkování pro registrační záznamy"
        wcag-select-label="Vybrat stránku"
        link="?str%C3%A1nka&#x3D;{PAGE}"
      >
      </gov-pagination>

    </nav>
  );
}
