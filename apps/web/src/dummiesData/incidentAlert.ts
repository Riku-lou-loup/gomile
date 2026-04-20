export type IncidentState = "EN COURS" | "ANNULE";

export type IncidentItem = {
  id: string;
  type: string;
  description: string;
  state: IncidentState;
};

export const incidents: IncidentItem[] = [
  {
    id: "4102",
    type: "Retard planifie",
    description: "Preparation plus longue que prevu cote commercant.",
    state: "EN COURS",
  },
  {
    id: "4099",
    type: "Livraison annulee",
    description: "Produit indisponible avant recuperation de la commande.",
    state: "ANNULE",
  },
];