@startuml
title Auth.RoleRouting

actor "Utilisateur" as user
boundary "Frontend Login Page" as frontend
boundary "AuthController" as controller
control "AuthService" as service
database "PrismaService / User" as prisma
control "bcrypt" as bcrypt
control "JwtService" as jwt
control "Frontend Router" as router

user -> frontend: Saisit email et mot de passe
frontend -> controller: POST /auth/login\n{ email, password }

controller -> service: login(dto)
service -> prisma: user.findUnique({ where: { email } })
prisma --> service: user | null

alt utilisateur introuvable
    service --> controller: UnauthorizedException
    controller --> frontend: 401 Unauthorized
    frontend --> user: Afficher erreur d'authentification
else utilisateur trouvé
    service -> bcrypt: compare(password, user.password)
    bcrypt --> service: true | false

    alt mot de passe incorrect
        service --> controller: UnauthorizedException
        controller --> frontend: 401 Unauthorized
        frontend --> user: Afficher erreur d'authentification
    else mot de passe correct
        service -> jwt: generate access token
        jwt --> service: accessToken
        service -> jwt: generate refresh token
        jwt --> service: refreshToken
        service -> prisma: update user.refreshToken
        prisma --> service: success
        service --> controller: { accessToken, refreshToken, user }
        controller --> frontend: 200 OK\n{ accessToken, refreshToken, user }
        frontend -> frontend: Stocker les tokens
        frontend -> router: Determiner la redirection selon user.role
        alt role = MERCHANT
            router --> user: Redirection vers dashboard commercant
        else role = DRIVER
            router --> user: Redirection vers espace livreur
        else role = ADMIN
            router --> user: Redirection vers panel administrateur
        else role inconnu
            router --> user: Redirection vers page d'erreur / acces refuse
        end
    end
end

@enduml
