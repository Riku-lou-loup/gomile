@startuml
title Auth.Logout

actor "Utilisateur" as user
boundary "AuthController" as controller
control "JwtAuthGuard" as guard
control "JwtStrategy" as strategy
control "AuthService" as service
database "PrismaService / User" as prisma

user -> controller: POST /auth/logout\nAuthorization: Bearer accessToken
controller -> guard: check access
guard -> strategy: validate(payload)

strategy -> prisma: find user by payload.sub
prisma --> strategy: user | null

alt utilisateur introuvable ou token invalide
    strategy --> controller: UnauthorizedException
    controller --> user: 401 Unauthorized
else utilisateur authentifié
    guard --> controller: request authorized
    controller -> service: logout(user.id)
    service -> prisma: update user.refreshToken = null
    prisma --> service: success
    service --> controller: { message: "Déconnecté avec succès" }
    controller --> user: 200 OK\n{ message: "Déconnecté avec succès" }
end

@enduml
