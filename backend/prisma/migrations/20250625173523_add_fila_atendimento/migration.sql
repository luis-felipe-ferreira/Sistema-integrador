-- CreateTable
CREATE TABLE "Paciente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data_nascimento" TEXT NOT NULL,
    "sexo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Triagem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "pressao" TEXT NOT NULL,
    "temperatura" TEXT NOT NULL,
    "frequencia" TEXT NOT NULL,
    "observacoes" TEXT,
    "prioridade" INTEGER NOT NULL,
    "data_hora_triagem" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Triagem_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FilaAtendimento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "triagemId" INTEGER NOT NULL,
    "pacienteNome" TEXT NOT NULL,
    "prioridade" INTEGER NOT NULL,
    "data_hora_chegada" DATETIME NOT NULL,
    CONSTRAINT "FilaAtendimento_triagemId_fkey" FOREIGN KEY ("triagemId") REFERENCES "Triagem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_cpf_key" ON "Paciente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "FilaAtendimento_triagemId_key" ON "FilaAtendimento"("triagemId");
