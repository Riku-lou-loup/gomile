import { STATUS_CODES } from "http";

export const DRIVER_ERROR = {
  DRIVER_BUSY : {
    statusCode : 409,
    message: "Une commande est en cours pour ce livreur, certains actions sont limitées"
  }

}