export type MapMarkerData = {
  id: string;
  lat: number;
  lng: number;
  tone: "green" | "amber" | "red";
  destination?: string;
  eta?: string;
  status?: string;
};

export const mapMarkers: MapMarkerData[] = [
  {
    id: "#4101",
    lat: 45.1908,
    lng: 5.7199,
    tone: "green",
    destination: "14 rue de l'Opera",
    eta: "11:30 h",
    status: "En route",
  },
  {
    id: "#4102",
    lat: 45.1862,
    lng: 5.7348,
    tone: "amber",
    destination: "8 Pl. de la Bastille",
    eta: "11:46 h",
    status: "En retard",
  },
  {
    id: "#4103",
    lat: 45.1945,
    lng: 5.7146,
    tone: "green",
    destination: "21 avenue Victor Hugo",
    eta: "12:05 h",
    status: "En route",
  },
  {
    id: "#4115",
    lat: 45.1918,
    lng: 5.7424,
    tone: "green",
    destination: "Cours Jean Jaures",
    eta: "12:12 h",
    status: "En route",
  },
  {
    id: "#992",
    lat: 45.1788,
    lng: 5.7212,
    tone: "green",
    destination: "Place Championnet",
    eta: "12:18 h",
    status: "En route",
  },
  {
    id: "#98",
    lat: 45.1808,
    lng: 5.7308,
    tone: "red",
    destination: "Quai Saint-Laurent",
    eta: "Incident",
    status: "Incident",
  },
  {
    id: "#499",
    lat: 45.1735,
    lng: 5.7131,
    tone: "red",
    destination: "Secteur Berriat",
    eta: "Incident",
    status: "Incident",
  },
  {
    id: "#12",
    lat: 45.1796,
    lng: 5.7459,
    tone: "amber",
    destination: "Ile Verte",
    eta: "12:24 h",
    status: "Attention",
  },
];