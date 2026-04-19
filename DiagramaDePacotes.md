%% Diagrama de Pacotes UML do Sistema Tira-Time
%% Representa os pacotes e suas dependências conforme a metodologia apresentada.

graph TD
    subgraph Client
        direction TB
        classDef package fill:#f9f,stroke:#333,stroke-width:2;
        Components[components]
        Layouts[layouts]
        Pages[pages]
        Services[services]
        Mocks[mocks]
    end

    subgraph API
        direction TB
        classDef package fill:#f9f,stroke:#333,stroke-width:2;
        Prisma[prisma]
        Src[src]
    end

    subgraph Assets
        direction TB
        classDef package fill:#f9f,stroke:#333,stroke-width:2;
        Public[public]
    end

    Client --> API
    Client --> Assets
    API --> Prisma
    API --> Assets