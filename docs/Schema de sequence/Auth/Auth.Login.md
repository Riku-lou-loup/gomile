@startuml
title Auth.Login

actor "Utilisateur" as user
boundary "AuthController" as controller
control "ValidationPipe" as validation
control "AuthService" as service
database "PrismaService / User" as prisma
control "bcrypt" as bcrypt
control "JwtService" as jwt

user -> controller: POST /auth/login\n{ email, password }

controller -> validation: validate(LoginDto)
alt DTO invalide
    validation --> controller: erreur de validation
    controller --> user: 400 Bad Request
else DTO valide
    validation --> controller: dto valide
    controller -> service: login(dto)
    service -> prisma: user.findUnique({ where: { email } })
    prisma --> service: user | null

    alt utilisateur introuvable
        service --> controller: UnauthorizedException
        controller --> user: 401 Unauthorized\n"Identifiants invalides"
    else utilisateur trouvé
        note over prisma,service
        Le mot de passe stocke en base est un hash bcrypt\n(champ User.password).
        end note

        service -> bcrypt: compare(dto.password, user.password)
        note right of bcrypt
        dto.password = mot de passe saisi en clair
        user.password = hash stocke en base
        end note

        bcrypt --> service: true | false

        alt mot de passe incorrect
            service --> controller: UnauthorizedException
            controller --> user: 401 Unauthorized\n"Identifiants invalides"
        else mot de passe correct
            service -> jwt: sign access token
            jwt --> service: accessToken

            service -> jwt: sign refresh token
            jwt --> service: refreshToken

            service -> prisma: update user.refreshToken
            prisma --> service: success

            service --> controller: { accessToken, refreshToken, user }
            controller --> user: 200 OK\n{ accessToken, refreshToken, user }
        end
    end
end

@enduml
