import { VNode } from "preact";
import renderToString from "preact-render-to-string/jsx";

const DOCTYPE = "<!DOCTYPE html>\n";

export function renderToHtml(element: VNode<{}>, pretty?: boolean): string {
  return DOCTYPE + renderToString(element, {}, { pretty: pretty ?? true });
}
