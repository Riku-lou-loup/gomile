@startuml
title Auth.RegisterDriver

actor "Livreur" as user
boundary "AuthController" as controller
control "ValidationPipe" as validation
control "AuthService" as service
database "PrismaService / User, Driver" as prisma
control "bcrypt" as bcrypt
control "JwtService" as jwt

user -> controller: POST /auth/register/driver\n{ email, password, name, phone }
controller -> validation: validate(RegisterDriverDto)
alt DTO invalide
    validation --> controller: erreur de validation
    controller --> user: 400 Bad Request
else DTO valide
    validation --> controller: dto valide
    controller -> service: registerDriver(dto)
    service -> prisma: user.findUnique({ where: { email } })
    prisma --> service: user | null

    alt email deja utilise
        service --> controller: ConflictException
        controller --> user: 409 Conflict\n"Email deja utilise"
    else email disponible
        service -> bcrypt: hash(dto.password, 10)
        bcrypt --> service: hashedPassword

        service -> prisma: create User(role=DRIVER)\n+ create Driver(name, phone)
        prisma --> service: created user

        service -> jwt: sign access token
        jwt --> service: accessToken

        service -> jwt: sign refresh token
        jwt --> service: refreshToken

        service -> prisma: update user.refreshToken
        prisma --> service: success

        service --> controller: { accessToken, refreshToken, user }
        controller --> user: 201 Created\n{ accessToken, refreshToken, user }
    end
end

@enduml
