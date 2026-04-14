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
  },
  ORDER_PICKUP_NO_LONGER_AVAILABLE : {
    statusCode: 409,
    message: "Cette commande a deja collectee"
  },
  ORDER_ALREADY_DELIVERED :  {
    statusCode: 409,
    message: "Cette commande a deja livree"
  },
  ORDER_BAD_STATUS: {
    statusCode: 500, // This should not happen, if it does, Samir will buy me a tacos
    message: "Etat de commande illegal"
  },
  HANDSHAKE_NOT_FOUND : {
    statusCode: 500,
    message: "Handshake non trouvable ?!"
  },
  HANDSHAKE_ATTEMPTS_PASSED: {
    statusCode: 429,
    message: "Vous avez depasse le nombre de tentatives autorisees. Veuillez contacter votre fiable admin"
  },
  HANDSHAKE_EXPIRED : {
    statusCode: 410, // GONE !!!!!! HANDSHAKE IS GONE
    message: "Handshake has expired"
  },
  INCORRECT_HANDSHAKE_CODE : {
    statusCode: 401,
    message: "Handshake OTP code incorrect"
  }
} as const;

export type OrderApiErrorCode = keyof typeof ORDER_ERRORS;