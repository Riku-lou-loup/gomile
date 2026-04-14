export const ORDER_ERRORS  = {
  ORDER_NOT_FOUND : {
    statusCode: 404,
    message: "Le commande cherche n'existe pas"
  },
  NOT_OWNER : {
    statusCode: 403,
    message : "Vous n'etes pas proprietaire de ce commande"
  },
  ORDER_ALREADY_PICKED_UP : {
    statusCode: 409,
    message: "Commande déjà partie ou en cours de livraison, annulation impossible"
  },
  ORDER_ALREADY_CANCELLED : {
    statusCode: 409,
    message: "Commande déjà annulé"
  },
  ORDER_ALREADY_TAKEN : {
    statusCode: 409,
    message: "Cette commande a deja ete acceptee par un autre livreur"
  }
} as const;

export type OrderApiErrorCode = keyof typeof ORDER_ERRORS;