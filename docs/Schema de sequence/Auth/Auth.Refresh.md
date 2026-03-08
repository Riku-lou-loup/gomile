@startuml
title Auth.Refresh

actor "Utilisateur" as user
boundary "AuthController" as controller
control "JwtRefreshGuard" as guard
control "JwtRefreshStrategy" as strategy
database "PrismaService / User" as prisma
control "AuthService" as service
control "JwtService" as jwt

user -> controller: POST /auth/refresh\nAuthorization: Bearer refreshToken
controller -> guard: canActivate(request)
guard -> strategy: validate(request, payload)
strategy -> strategy: extract refresh token from Authorization header
strategy -> prisma: user.findUnique({ where: { id: payload.sub } })
prisma --> strategy: user | null

alt utilisateur introuvable
    strategy --> guard: UnauthorizedException
    guard --> user: 401 Unauthorized
else utilisateur trouvé
    strategy -> strategy: compare provided token with user.refreshToken
    alt refresh token invalide
        strategy --> guard: UnauthorizedException
        guard --> user: 401 Unauthorized
    else refresh token valide
        strategy --> guard: authenticated user
        guard --> controller: request authorized
        controller -> service: refresh(user.id, user.email, user.role)

        par generation des nouveaux tokens
            service -> jwt: signAsync(payload, access secret, 15m)
            jwt --> service: accessToken
            service -> jwt: signAsync(payload, refresh secret, 7d)
            jwt --> service: refreshToken
        end

        service -> prisma: user.update({ refreshToken })
        prisma --> service: user mis a jour
        service --> controller: { accessToken, refreshToken, user }
        controller --> user: 200 OK\n{ accessToken, refreshToken, user }
    end
end

@enduml
