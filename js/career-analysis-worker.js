"use strict";

importScripts("career-analysis-core.js");

self.addEventListener("message", (evento) => {
  const mensagem = evento.data;
  const id = mensagem?.id;

  try {
    if (
      !mensagem ||
      typeof id !== "number" ||
      mensagem.tipo !== "calcular-recordes"
    ) {
      throw new TypeError("Mensagem inválida para o Worker de análise.");
    }

    self.postMessage({
      id,
      recordes: self.FootMainCareerAnalysis.calcularRecordes(
        mensagem.carreiras,
      ),
    });
  } catch (erro) {
    self.postMessage({
      id,
      erro: erro instanceof Error ? erro.message : String(erro),
    });
  }
});
