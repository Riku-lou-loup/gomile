import { cn } from "../style";
import type { StoreListItem } from "../shops/store.model";
import type { CreateOrderInput } from "./order.model";

export type OrderActionTone = "danger";

export type OrderFormSeed = {
  customerName: string;
  customerPhone: string;
  dropOffAddress: string;
  storeId: string;
};

export const ORDER_FIELD_IDS = {
  customerName: "swal-order-customer-name",
  customerPhone: "swal-order-customer-phone",
  dropOffAddress: "swal-order-dropoff-address",
  storeId: "swal-order-store-id",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function getOrderActionButtonClassName(
  isDarkMode: boolean,
  tone: OrderActionTone,
) {
  const shared = "!h-9 !w-9 !rounded-full !p-0 !border !shadow-none";

  if (tone === "danger") {
    return cn(
      shared,
      isDarkMode
        ? "!border-rose-800 !text-rose-300 hover:!bg-rose-950/50"
        : "!border-rose-200 !text-rose-700 hover:!bg-rose-50",
    );
  }

  return shared;
}

export function buildOrderFormSeed(
  stores: StoreListItem[],
  storeId?: string,
): OrderFormSeed {
  return {
    customerName: "",
    customerPhone: "",
    dropOffAddress: "",
    storeId: storeId ?? stores[0]?.id ?? "",
  };
}

function buildStoreOptionsHtml(stores: StoreListItem[], selectedStoreId: string) {
  return stores.map((store) => `
    <option value="${escapeHtml(store.id)}" ${store.id === selectedStoreId ? "selected" : ""}>
      ${escapeHtml(store.name)}
    </option>
  `).join("");
}

// This helper builds the HTML injected into SweetAlert.
// Keeping it here lets the React table component stay focused on JSX only.
export function buildCreateOrderPanelHtml(
  seed: OrderFormSeed,
  stores: StoreListItem[],
) {
  return `
    <div style="display:grid;gap:12px;text-align:left;margin-top:12px;">
      <div style="display:grid;gap:6px;">
        <label for="${ORDER_FIELD_IDS.storeId}" style="font-size:13px;font-weight:600;color:#334155;">Magasin</label>
        <select id="${ORDER_FIELD_IDS.storeId}" class="swal2-select" style="width:100%;margin:0;">
          <option value="">Selectionnez un magasin</option>
          ${buildStoreOptionsHtml(stores, seed.storeId)}
        </select>
      </div>
      <div style="display:grid;gap:6px;">
        <label for="${ORDER_FIELD_IDS.customerName}" style="font-size:13px;font-weight:600;color:#334155;">Nom du client</label>
        <input id="${ORDER_FIELD_IDS.customerName}" class="swal2-input" placeholder="Ex: Jean Dupont" value="${escapeHtml(seed.customerName)}" style="width:100%;margin:0;" />
      </div>
      <div style="display:grid;gap:6px;">
        <label for="${ORDER_FIELD_IDS.customerPhone}" style="font-size:13px;font-weight:600;color:#334155;">Telephone du client</label>
        <input id="${ORDER_FIELD_IDS.customerPhone}" class="swal2-input" placeholder="Ex: +33 6 12 34 56 78" value="${escapeHtml(seed.customerPhone)}" style="width:100%;margin:0;" />
      </div>
      <div style="display:grid;gap:6px;">
        <label for="${ORDER_FIELD_IDS.dropOffAddress}" style="font-size:13px;font-weight:600;color:#334155;">Adresse de livraison</label>
        <textarea id="${ORDER_FIELD_IDS.dropOffAddress}" class="swal2-textarea" placeholder="Ex: 12 rue Lesdiguieres, Grenoble" style="width:100%;height:110px;margin:0;">${escapeHtml(seed.dropOffAddress)}</textarea>
      </div>
    </div>
  `;
}

function readOrderPanelValue(
  popup: HTMLElement | null,
  selector: string,
): string {
  const element = popup?.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    `#${selector}`,
  );

  return element?.value.trim() ?? "";
}

// This function converts the raw SweetAlert DOM values into the payload expected
// by the API and returns the chosen store id separately.
export function parseCreateOrderInput(
  popup: HTMLElement | null,
): { error: string } | { storeId: string; value: CreateOrderInput } {
  const storeId = readOrderPanelValue(popup, ORDER_FIELD_IDS.storeId);
  const customerName = readOrderPanelValue(popup, ORDER_FIELD_IDS.customerName);
  const customerPhone = readOrderPanelValue(popup, ORDER_FIELD_IDS.customerPhone);
  const dropOffAddress = readOrderPanelValue(popup, ORDER_FIELD_IDS.dropOffAddress);

  if (!storeId) {
    return { error: "Choisissez le magasin qui emet cette commande." };
  }

  if (!customerName || !customerPhone || !dropOffAddress) {
    return {
      error: "Le nom, le telephone et l'adresse de livraison sont obligatoires.",
    };
  }

  return {
    storeId,
    value: {
      customerName,
      customerPhone,
      dropOffAddress,
    },
  };
}
