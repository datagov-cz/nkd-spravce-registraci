// Ambient JSX declarations for the gov.cz design-system web components.

import {} from "preact";

// Permissive attribute bag.
// Keeps typed access to standard  attributes `class`, `className`, `slot, ...
// also allow the design system's kebab-case props such as `justify-content`,
// `align-items` or `col-span`.
type GovElementAttributes = preact.JSX.HTMLAttributes<HTMLElement> & {
  [attribute: string]: unknown;
};

declare module "preact" {
  namespace JSX {
    interface IntrinsicElements {
      "gov-flex": GovElementAttributes;
      "gov-button": GovElementAttributes;
      "gov-icon": GovElementAttributes;
      "gov-theme-switch": GovElementAttributes;
      "gov-container": GovElementAttributes;
      "gov-error-code": GovElementAttributes;
      "gov-grid": GovElementAttributes;
      "gov-grid-item": GovElementAttributes;
      "gov-tile": GovElementAttributes;
      "gov-form-control": GovElementAttributes;
      "gov-form-label": GovElementAttributes;
      "gov-form-group": GovElementAttributes;
      "gov-form-file": GovElementAttributes;
      "gov-empty": GovElementAttributes;
      "gov-card": GovElementAttributes;
      "gov-pagination": GovElementAttributes;
    }
  }
}
