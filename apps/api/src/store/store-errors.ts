export const STORE_ERRORS = {
    STORE_NAME_ALREADY_USED: {
        statusCode: 409,
        message: 'Nom de magasin deja utilise',
    },

    STORE_NOT_FOUND: {
        statusCode: 404,
        message: 'Magasin non trouve',
    },
    NOT_OWNER: {
      statusCode: 403,
      message: "Vous netes pas le proprietaire de cette ressource",
    },
    DOMAIN_REQUIRED_WITH_PROVIDER: {
      statusCode: 400,
      message: "Un domaine est requis lorsqu'un fournisseur est specifie",
    },

} as const;

export type StoreApiErrorCode = keyof typeof STORE_ERRORS;

