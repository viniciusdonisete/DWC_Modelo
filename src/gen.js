// ====== Perfis de amostragem, árvore de decisão, termos Darwin Core e gerador ======
const VERSAO_MODELO = "0.3-prototipo";

// k: "obs" = registro sem captura (visual, auditivo, imagem, vestígio) | "cap" = captura, manuseio ou coleta
// p = samplingProtocol; u = sampleSizeUnit; e = como calcular o esforço
const GRUPOS = {
  AVE: {
    nome: "Aves", meio: "terrestre", taxon: "Aves", marca: true,
    metodos: [
      { c: "PE", k: "obs", n: "Pontos de escuta", p: "Pontos de escuta (contagem por pontos)", u: "minutos", e: "nº de pontos × minutos por ponto" },
      { c: "LM", k: "obs", n: "Listas de Mackinnon", p: "Listas de Mackinnon", u: "listas", e: "nº de listas de 10 espécies" },
      { c: "TR", k: "obs", n: "Transecção linear", p: "Transecção linear", u: "km", e: "comprimento percorrido (km)" },
      { c: "PB", k: "obs", n: "Playback", p: "Playback", u: "minutos", e: "nº de pontos × minutos de reprodução" },
      { c: "GA", k: "obs", n: "Gravador autônomo", p: "Monitoramento acústico passivo", u: "h", e: "horas de gravação analisadas" },
      { c: "RN", k: "cap", n: "Redes de neblina", p: "Captura com redes de neblina", u: "h.m²", e: "área das redes (m²) × horas abertas" },
      { c: "EO", k: "obs", n: "Registro ocasional", p: "Registro ocasional", u: "", e: "sem esforço padronizado" },
    ],
    medidas: [["massa corporal", "g"], ["comprimento da asa", "mm"], ["comprimento da cauda", "mm"], ["comprimento do tarso", "mm"], ["comprimento do cúlmen exposto", "mm"], ["escore de gordura", "escore"], ["placa de incubação", "escore"], ["muda", "categoria"]],
  },
  HER: {
    nome: "Anfíbios e répteis", meio: "terrestre", taxon: "Amphibia, Reptilia", marca: true,
    metodos: [
      { c: "BA", k: "obs", n: "Busca ativa limitada por tempo", p: "Busca ativa limitada por tempo", u: "h.pessoa", e: "horas de busca × nº de pesquisadores" },
      { c: "SR", k: "obs", n: "Procura em sítio reprodutivo", p: "Procura em sítio reprodutivo", u: "h.pessoa", e: "horas × nº de pesquisadores" },
      { c: "GA", k: "obs", n: "Gravador autônomo", p: "Monitoramento acústico passivo", u: "h", e: "horas de gravação analisadas" },
      { c: "PF", k: "cap", n: "Pitfall com cerca-guia", p: "Armadilhas de interceptação e queda (pitfall)", u: "balde.dia", e: "nº de baldes × dias abertos" },
      { c: "FU", k: "cap", n: "Armadilha de funil", p: "Armadilha de funil", u: "armadilha.dia", e: "nº de armadilhas × dias abertas" },
      { c: "EO", k: "obs", n: "Encontro ocasional", p: "Encontro ocasional", u: "", e: "sem esforço padronizado" },
    ],
    medidas: [["comprimento rostro-cloacal", "mm"], ["comprimento da cauda", "mm"], ["massa corporal", "g"]],
  },
  MPE: {
    nome: "Pequenos mamíferos não voadores", meio: "terrestre", taxon: "Rodentia, Didelphimorphia", marca: true,
    metodos: [
      { c: "SH", k: "cap", n: "Armadilhas Sherman", p: "Armadilhas de captura viva tipo Sherman", u: "armadilha.noite", e: "nº de armadilhas × noites" },
      { c: "TO", k: "cap", n: "Armadilhas Tomahawk", p: "Armadilhas de captura viva tipo Tomahawk", u: "armadilha.noite", e: "nº de armadilhas × noites" },
      { c: "PF", k: "cap", n: "Pitfall com cerca-guia", p: "Armadilhas de interceptação e queda (pitfall)", u: "balde.noite", e: "nº de baldes × noites" },
    ],
    medidas: [["massa corporal", "g"], ["comprimento cabeça-corpo", "mm"], ["comprimento da cauda", "mm"], ["comprimento do pé posterior", "mm"], ["comprimento da orelha", "mm"]],
  },
  MMG: {
    nome: "Mamíferos de médio e grande porte", meio: "terrestre", taxon: "Mammalia", marca: false,
    metodos: [
      { c: "AF", k: "obs", n: "Armadilhas fotográficas", p: "Armadilhas fotográficas", u: "câmera.dia", e: "nº de câmeras × dias ativas" },
      { c: "TV", k: "obs", n: "Transecção com busca de vestígios", p: "Transecção com busca de vestígios", u: "km", e: "comprimento percorrido (km)" },
      { c: "PA", k: "obs", n: "Parcelas de areia", p: "Parcelas de areia", u: "parcela.noite", e: "nº de parcelas × noites" },
      { c: "EO", k: "obs", n: "Encontro ocasional", p: "Encontro ocasional", u: "", e: "sem esforço padronizado" },
    ],
    medidas: [],
  },
  QUI: {
    nome: "Morcegos", meio: "terrestre", taxon: "Chiroptera", marca: true,
    metodos: [
      { c: "AC", k: "obs", n: "Monitoramento acústico", p: "Gravação de ultrassom (detector acústico)", u: "h", e: "horas de gravação" },
      { c: "RN", k: "cap", n: "Redes de neblina", p: "Captura com redes de neblina", u: "h.m²", e: "área das redes (m²) × horas abertas" },
      { c: "AB", k: "cap", n: "Busca em abrigos", p: "Busca ativa em abrigos", u: "h.pessoa", e: "horas × nº de pesquisadores" },
    ],
    medidas: [["massa corporal", "g"], ["comprimento do antebraço", "mm"]],
  },
  ENT: {
    nome: "Insetos", meio: "terrestre", taxon: "Insecta", marca: false, coletaInerente: true,
    metodos: [
      { c: "LU", k: "cap", n: "Armadilha luminosa", p: "Armadilha luminosa (CDC / Shannon)", u: "armadilha.noite", e: "nº de armadilhas × noites" },
      { c: "VS", k: "cap", n: "Van Someren-Rydon", p: "Armadilha de isca Van Someren-Rydon", u: "armadilha.dia", e: "nº de armadilhas × dias" },
      { c: "MA", k: "cap", n: "Armadilha Malaise", p: "Armadilha Malaise", u: "armadilha.dia", e: "nº de armadilhas × dias" },
      { c: "PF", k: "cap", n: "Pitfall", p: "Armadilha de queda (pitfall)", u: "armadilha.dia", e: "nº de armadilhas × dias" },
      { c: "RE", k: "cap", n: "Rede entomológica", p: "Busca ativa com rede entomológica", u: "h.pessoa", e: "horas × nº de pesquisadores" },
    ],
    medidas: [],
  },
  OUT_T: {
    nome: "Outro grupo terrestre", meio: "terrestre", taxon: "não listado", marca: true, outro: true,
    metodos: [
      { c: "BA", k: "obs", n: "Busca ativa", p: "Busca ativa", u: "h.pessoa", e: "horas × nº de pesquisadores" },
      { c: "TR", k: "obs", n: "Transecção", p: "Transecção", u: "km", e: "comprimento percorrido (km)" },
      { c: "AF", k: "obs", n: "Armadilha fotográfica", p: "Armadilhas fotográficas", u: "câmera.dia", e: "nº de câmeras × dias ativas" },
      { c: "AV", k: "cap", n: "Armadilha de captura viva", p: "Armadilha de captura viva", u: "armadilha.noite", e: "nº de armadilhas × noites" },
      { c: "PF", k: "cap", n: "Pitfall", p: "Armadilhas de interceptação e queda (pitfall)", u: "balde.dia", e: "nº de baldes × dias" },
      { c: "EO", k: "obs", n: "Encontro ocasional", p: "Encontro ocasional", u: "", e: "sem esforço padronizado" },
    ],
    medidas: [["massa corporal", "g"], ["comprimento total", "mm"]],
  },
  ICT: {
    nome: "Peixes", meio: "aquatico", taxon: "Actinopterygii", marca: false,
    metodos: [
      { c: "SN", k: "obs", n: "Censo visual subaquático", p: "Censo visual subaquático (snorkeling)", u: "minutos", e: "minutos de observação" },
      { c: "RE", k: "cap", n: "Redes de espera", p: "Redes de espera", u: "m².h", e: "área das redes (m²) × horas na água" },
      { c: "TA", k: "cap", n: "Tarrafa", p: "Tarrafa", u: "lances", e: "nº de lances" },
      { c: "PN", k: "cap", n: "Peneira", p: "Peneira", u: "lances", e: "nº de lances" },
      { c: "AR", k: "cap", n: "Arrasto", p: "Rede de arrasto", u: "lances", e: "nº de arrastos" },
      { c: "CV", k: "cap", n: "Covo", p: "Covo", u: "covo.h", e: "nº de covos × horas" },
      { c: "PE", k: "cap", n: "Pesca elétrica", p: "Pesca elétrica", u: "minutos", e: "minutos de esforço" },
    ],
    medidas: [["comprimento total", "mm"], ["comprimento padrão", "mm"], ["massa corporal", "g"], ["estádio gonadal", "categoria"]],
  },
  BEN: {
    nome: "Macroinvertebrados bentônicos", meio: "aquatico", taxon: "Invertebrados aquáticos", marca: false, coletaInerente: true,
    metodos: [
      { c: "SU", k: "cap", n: "Amostrador Surber", p: "Amostrador Surber", u: "m²", e: "área amostrada (m²)" },
      { c: "DR", k: "cap", n: "Draga (Petersen / Ekman)", p: "Draga de fundo", u: "m²", e: "área amostrada (m²)" },
      { c: "RD", k: "cap", n: "Rede em D", p: "Rede em D (kick-net)", u: "minutos", e: "minutos de varredura" },
    ],
    medidas: [],
  },
  OUT_A: {
    nome: "Outro grupo aquático", meio: "aquatico", taxon: "não listado", marca: false, outro: true,
    metodos: [
      { c: "BA", k: "obs", n: "Busca ativa", p: "Busca ativa", u: "h.pessoa", e: "horas × nº de pesquisadores" },
      { c: "RA", k: "cap", n: "Coleta com rede", p: "Coleta com rede", u: "lances", e: "nº de lances" },
      { c: "AQ", k: "cap", n: "Armadilha aquática", p: "Armadilha aquática", u: "armadilha.h", e: "nº de armadilhas × horas" },
      { c: "AF", k: "cap", n: "Amostrador de fundo", p: "Amostrador de fundo", u: "m²", e: "área amostrada (m²)" },
      { c: "EO", k: "obs", n: "Encontro ocasional", p: "Encontro ocasional", u: "", e: "sem esforço padronizado" },
    ],
    medidas: [["comprimento total", "mm"], ["massa corporal", "g"]],
  },
};

const AMB_TERRESTRE = [["temperatura do ar", "°C"], ["umidade relativa do ar", "%"], ["nebulosidade", "%"], ["velocidade do vento", "escala Beaufort"]];
const AMB_AQUATICO = [["temperatura da água", "°C"], ["oxigênio dissolvido", "mg/L"], ["pH", "unidade de pH"], ["condutividade elétrica", "µS/cm"], ["turbidez", "NTU"]];

const VOCAB = {
  basisOfRecord: ["HumanObservation", "MachineObservation", "PreservedSpecimen", "LivingSpecimen", "MaterialSample"],
  occurrenceStatus: ["present", "absent"],
  taxonRank: ["species", "subspecies", "genus", "family", "order", "class"],
  identificationQualifier: ["cf.", "aff.", "sp."],
  sex: ["male", "female", "undetermined"],
  lifeStage: ["adult", "juvenile", "larva", "tadpole", "egg", "undetermined"],
  geodeticDatum: ["EPSG:4674", "EPSG:4326"],
  countryCode: ["BR"],
  stateProvince: ["Minas Gerais"],
  habitat: ["Floresta Estacional Semidecidual", "Floresta Ombrófila", "Mata ciliar / galeria", "Cerrado sentido restrito", "Cerradão", "Campo rupestre", "Campo limpo / sujo", "Canga", "Vereda", "Silvicultura", "Pastagem", "Área antropizada", "Ambiente aquático lótico", "Ambiente aquático lêntico"],
  preparations: ["pele", "esqueleto", "via úmida (álcool 70%)", "tecido (álcool absoluto)", "formol 10%"],
};

// Termos Darwin Core: [definição, como preencher, exemplo]
const TERMOS = {
  eventID: ["Identificador único do evento.", "Não pode repetir. Sugestão: campanha-ponto-método-data.", "C1-P01-RN-20260312"],
  parentEventID: ["eventID da campanha a que esta amostragem pertence.", "Escolha na lista. Nas linhas de campanha, deixe vazio.", "C1"],
  eventDate: ["Data do evento no formato ISO 8601.", "AAAA-MM-DD. Para campanhas, intervalo AAAA-MM-DD/AAAA-MM-DD.", "2026-03-12"],
  eventTime: ["Horário do evento.", "hh:mm ou intervalo hh:mm/hh:mm.", "17:30/23:30"],
  samplingProtocol: ["Método de amostragem.", "Escolha na lista. Linhas de campanha ficam vazias.", "Captura com redes de neblina"],
  sampleSizeValue: ["Valor numérico do esforço amostral.", "Número total, na unidade de sampleSizeUnit.", "720"],
  sampleSizeUnit: ["Unidade do esforço amostral.", "Preenchida automaticamente a partir do samplingProtocol.", "h.m²"],
  samplingEffort: ["Descrição do esforço.", "Texto livre com a conta usada.", "10 redes de 12x3 m por 2 h"],
  locationID: ["Código do ponto amostral.", "Mesmo código para o mesmo ponto em todas as campanhas.", "P01"],
  habitat: ["Fitofisionomia ou ambiente do ponto.", "Escolha na lista.", "Cerrado sentido restrito"],
  countryCode: ["Código do país (ISO 3166-1).", "BR.", "BR"],
  stateProvince: ["Estado.", "Escolha na lista.", "Minas Gerais"],
  municipality: ["Município.", "Nome completo, com acentos.", "Itabirito"],
  locality: ["Descrição do local.", "Referência que permita reencontrar o ponto.", "Margem esquerda do córrego Seco"],
  decimalLatitude: ["Latitude em graus decimais.", "Número negativo (hemisfério sul), com 5 ou 6 casas decimais.", "-20.253412"],
  decimalLongitude: ["Longitude em graus decimais.", "Número negativo (oeste de Greenwich), com 5 ou 6 casas decimais.", "-43.801234"],
  geodeticDatum: ["Datum das coordenadas.", "EPSG:4674 = SIRGAS 2000; EPSG:4326 = WGS 84.", "EPSG:4674"],
  coordinateUncertaintyInMeters: ["Incerteza da coordenada, em metros.", "Número inteiro. GPS de mão: 5 a 15 m.", "10"],
  minimumElevationInMeters: ["Altitude do ponto, em metros.", "Número inteiro.", "1120"],
  eventRemarks: ["Observações sobre o evento.", "Condições, problemas, desvios do protocolo.", "Chuva a partir das 21 h"],

  occurrenceID: ["Identificador único do registro.", "Não pode repetir. Sugestão: eventID + número sequencial.", "C1-P01-RN-20260312-001"],
  basisOfRecord: ["Natureza do registro.", "HumanObservation: visto, ouvido ou capturado e solto. MachineObservation: câmera ou gravador. PreservedSpecimen: coletado.", "HumanObservation"],
  occurrenceStatus: ["Presença ou ausência.", "present ou absent.", "present"],
  scientificName: ["Nome científico do táxon.", "Sem autor e sem cf./aff. (use identificationQualifier).", "Turdus leucomelas"],
  taxonRank: ["Nível taxonômico do nome.", "Escolha na lista.", "species"],
  identificationQualifier: ["Incerteza da identificação.", "cf., aff. ou sp. Vazio se a identificação for segura.", "cf."],
  vernacularName: ["Nome popular.", "Opcional.", "sabiá-barranco"],
  class: ["Classe.", "Nome científico da classe.", "Aves"],
  order: ["Ordem.", "Nome científico da ordem.", "Passeriformes"],
  family: ["Família.", "Nome científico da família.", "Turdidae"],
  individualCount: ["Número de indivíduos.", "Número inteiro. Use 0 apenas com occurrenceStatus = absent.", "3"],
  sex: ["Sexo.", "male, female ou undetermined.", "female"],
  lifeStage: ["Estágio de vida.", "Escolha na lista.", "adult"],
  organismID: ["Identificador do indivíduo marcado.", "Nº da anilha, brinco ou PIT. Recapturas repetem o mesmo valor.", "CEMAVE E-012345"],
  recordNumber: ["Número de campo do espécime.", "Número dado pelo coletor.", "VD-0153"],
  preparations: ["Preparação do material coletado.", "Escolha na lista.", "pele"],
  institutionCode: ["Sigla da coleção depositária.", "Sigla oficial da instituição.", "UFMG"],
  catalogNumber: ["Número de tombo.", "Número na coleção.", "DZUFMG 4512"],
  recordedBy: ["Quem registrou.", "Nomes separados por |.", "Ana Souza | João Lima"],
  identifiedBy: ["Quem identificou.", "Nomes separados por |.", "Ana Souza"],
  occurrenceRemarks: ["Observações sobre o registro.", "Texto livre.", "Indivíduo em muda"],

  measurementType: ["O que foi medido.", "Escolha na lista. Medida do indivíduo: preencha occurrenceID. Medida do ambiente: preencha eventID.", "massa corporal"],
  measurementValue: ["Valor medido.", "Somente o número, sem unidade.", "54.5"],
  measurementUnit: ["Unidade da medida.", "Preenchida automaticamente a partir do measurementType.", "g"],
  measurementMethod: ["Como a medida foi tomada.", "Instrumento ou procedimento.", "Pesola 100 g"],
  measurementDeterminedBy: ["Quem mediu.", "Nomes separados por |.", "Ana Souza"],
  measurementRemarks: ["Observações sobre a medida.", "Texto livre.", "Pesado com saco"],
};
TERMOS["measurementorfact.occurrenceID"] = ["occurrenceID do indivíduo medido.", "Escolha na lista. Deixe vazio para medidas do ambiente.", "C1-P01-RN-20260312-001"];
TERMOS["measurementorfact.eventID"] = ["eventID da amostragem medida.", "Escolha na lista. Use para medidas do ambiente; deixe vazio para medidas de indivíduos.", "C1-P01-RN-20260312"];
TERMOS["occurrence.eventID"] = ["eventID da amostragem em que o registro foi feito.", "Escolha na lista: só aparecem eventos já cadastrados na aba event.", "C1-P01-RN-20260312"];

// ---------- Árvore de decisão ----------
const OUTRO = "OUTRO";
const VARIAVEIS = { terrestre: AMB_TERRESTRE, aquatico: AMB_AQUATICO };
const sn = (dSim, dNao) => [{ v: "sim", t: "Sim", d: dSim }, { v: "nao", t: "Não", d: dNao }];

function grupoFinal(r) { return r.grupo === "MAM" ? r.porte : r.grupo; }
function metodosPermitidos(r) {
  const g = GRUPOS[grupoFinal(r)];
  return g.metodos.filter((m) => !r.registro || r.registro === "ambos" || m.k === r.registro);
}
function temCaptura(r) {
  const g = GRUPOS[grupoFinal(r)];
  return (r.metodos || []).some((c) => c === OUTRO ? r.registro !== "obs" : (g.metodos.find((m) => m.c === c) || {}).k === "cap");
}

// Cada nó: id, pergunta, tipo (um | varios), opções. A ordem e a presença dos nós vêm de fluxo().
const NOS = {
  meio: { t: "Onde a amostragem foi feita?", sub: "Primeiro ramo da árvore: define os grupos e as variáveis ambientais possíveis.", tipo: "um", rotulo: "Meio",
    opcoes: () => [{ v: "terrestre", t: "Ambiente terrestre", d: "Aves, anfíbios e répteis, mamíferos, insetos" }, { v: "aquatico", t: "Ambiente aquático", d: "Peixes, macroinvertebrados bentônicos" }] },
  grupo: { t: "Qual grupo foi amostrado?", sub: "Cada grupo gera uma planilha própria.", tipo: "um", rotulo: "Grupo",
    opcoes: (r) => {
      const ops = Object.entries(GRUPOS).filter(([id, g]) => g.meio === r.meio && !["MPE", "MMG", "QUI"].includes(id) && !g.outro).map(([v, g]) => ({ v, t: g.nome, d: g.taxon }));
      if (r.meio === "terrestre") ops.splice(2, 0, { v: "MAM", t: "Mamíferos", d: "Pequenos, médios e grandes, morcegos" });
      ops.push({ v: r.meio === "terrestre" ? "OUT_T" : "OUT_A", t: "Outro grupo", d: "Grupo não listado: métodos genéricos" });
      return ops;
    } },
  porte: { t: "Qual grupo de mamíferos?", sub: "Os métodos de amostragem são diferentes para cada um.", tipo: "um", rotulo: "Mamíferos",
    opcoes: () => ["MPE", "MMG", "QUI"].map((v) => ({ v, t: GRUPOS[v].nome, d: GRUPOS[v].taxon })) },
  registro: { t: "Como os animais foram registrados?", sub: "Filtra os métodos e decide se entram perguntas sobre biometria, marcação e coleta.", tipo: "um", rotulo: "Registro",
    opcoes: () => [
      { v: "obs", t: "Sem captura", d: "Visual, auditivo, imagens, gravações ou vestígios" },
      { v: "cap", t: "Com captura ou manuseio", d: "Redes, armadilhas, coleta" },
      { v: "ambos", t: "Os dois", d: "Métodos com e sem captura" }] },
  metodos: { t: "Quais métodos foram usados?", sub: "Marque todos. Eles formam a lista de samplingProtocol.", tipo: "varios", rotulo: "Métodos",
    opcoes: (r) => [...metodosPermitidos(r).map((m) => ({ v: m.c, t: m.n, d: m.u ? `esforço: ${m.e}` : m.e })),
      { v: OUTRO, t: "Outro método", d: "Não listado: a planilha terá linhas para cadastrá-lo na aba protocolos" }] },
  campanhas: { t: "O estudo foi organizado em campanhas?", sub: "Campanhas viram eventos-pai das amostragens (parentEventID).", tipo: "um", rotulo: "Campanhas",
    opcoes: () => sn("Ex.: campanhas de seca e de chuva", "Amostragem única") },
  biometria: { t: "Os animais capturados foram medidos ou pesados?", sub: "As medidas vão para a aba measurementorfact.", tipo: "um", rotulo: "Biometria",
    opcoes: () => sn("Na próxima pergunta você escolhe quais medidas", "Apenas identificação e contagem") },
  medidas: { t: "Quais medidas foram tomadas?", sub: "Somente as marcadas aparecem na lista de measurementType.", tipo: "varios", rotulo: "Medidas",
    opcoes: (r) => [...GRUPOS[grupoFinal(r)].medidas.map(([n, u]) => ({ v: n, t: n, d: `unidade: ${u}` })),
      { v: OUTRO, t: "Outra medida", d: "Não listada: a planilha terá linhas para cadastrá-la na aba medidas" }] },
  marcacao: { t: "Houve marcação individual?", sub: "Anilha, brinco, PIT tag ou outra marca.", tipo: "um", rotulo: "Marcação",
    opcoes: () => sn("Inclui a coluna organismID", "Sem identificação de indivíduos") },
  coleta: { t: "Algum espécime foi coletado?", sub: "Material tombado em coleção científica.", tipo: "um", rotulo: "Coleta",
    opcoes: () => sn("Nº de campo, preparação, coleção e tombo", "Todos os animais foram soltos") },
  ambiente: { t: "Foram medidas variáveis ambientais?", sub: "Medidas tomadas a cada amostragem, ligadas ao eventID.", tipo: "um", rotulo: "Ambiente",
    opcoes: () => sn("Na próxima pergunta você escolhe quais", "Sem medidas do ambiente") },
  variaveis: { t: "Quais variáveis ambientais?", sub: "Somente as marcadas aparecem na lista de measurementType.", tipo: "varios", rotulo: "Variáveis",
    opcoes: (r) => [...VARIAVEIS[r.meio].map(([n, u]) => ({ v: n, t: n, d: `unidade: ${u}` })),
      { v: OUTRO, t: "Outra variável", d: "Não listada: a planilha terá linhas para cadastrá-la na aba medidas" }] },
};
Object.entries(NOS).forEach(([id, n]) => (n.id = id));

const respondido = (n, r) => (n.tipo === "varios" ? (r[n.id] || []).length > 0 : r[n.id] != null);

// Percorre a árvore: devolve os nós do caminho atual, parando no primeiro sem resposta
function fluxo(r) {
  const out = [];
  const passo = (id) => { out.push(NOS[id]); return respondido(NOS[id], r); };
  if (!passo("meio") || !passo("grupo")) return out;
  if (r.grupo === "MAM" && !passo("porte")) return out;
  const g = GRUPOS[grupoFinal(r)];
  if (new Set(g.metodos.map((m) => m.k)).size > 1 && !passo("registro")) return out;
  if (!passo("metodos") || !passo("campanhas")) return out;
  const cap = temCaptura(r);
  if (cap && g.medidas.length) {
    if (!passo("biometria")) return out;
    if (r.biometria === "sim" && !passo("medidas")) return out;
  }
  if (cap && g.marca && !passo("marcacao")) return out;
  if (cap && !g.coletaInerente && !passo("coleta")) return out;
  if (!passo("ambiente")) return out;
  if (r.ambiente === "sim" && !passo("variaveis")) return out;
  out.completo = true;
  return out;
}

// Remove respostas que deixaram de valer depois de uma mudança num ramo anterior
function podar(r) {
  for (let i = 0; i < 20; i++) {
    const caminho = fluxo(r);
    const ids = new Set(caminho.map((n) => n.id));
    let mudou = false;
    Object.keys(r).forEach((k) => { if (!ids.has(k)) { delete r[k]; mudou = true; } });
    caminho.forEach((n) => {
      if (!(n.id in r)) return;
      const validos = new Set(n.opcoes(r).map((o) => o.v));
      if (n.tipo === "varios") { const f = r[n.id].filter((v) => validos.has(v)); if (f.length !== r[n.id].length) { r[n.id] = f; mudou = true; } }
      else if (!validos.has(r[n.id])) { delete r[n.id]; mudou = true; }
    });
    if (!mudou) return r;
  }
  return r;
}

// ---------- Estrutura do template a partir das respostas ----------
function estrutura(r) {
  const gid = grupoFinal(r);
  const g = GRUPOS[gid];
  const ids = new Set(fluxo(r).map((n) => n.id));
  const sim = (k) => ids.has(k) && r[k] === "sim";
  const escolhidas = (k) => (ids.has(k) ? r[k] || [] : []);
  const medidas = [
    ...g.medidas.filter(([n]) => sim("biometria") && escolhidas("medidas").includes(n)).map(([n, u]) => ({ n, u, nivel: "occurrenceID" })),
    ...VARIAVEIS[g.meio].filter(([n]) => sim("ambiente") && escolhidas("variaveis").includes(n)).map(([n, u]) => ({ n, u, nivel: "eventID" })),
  ];
  const outraMedida = escolhidas("medidas").includes(OUTRO) || escolhidas("variaveis").includes(OUTRO);
  const outroMetodo = (r.metodos || []).includes(OUTRO);
  const coleta = g.coletaInerente || sim("coleta");
  const event = [
    { t: "eventID", req: 1 },
    ...(sim("campanhas") ? [{ t: "parentEventID" }] : []),
    { t: "eventDate", req: 1 }, { t: "eventTime" },
    { t: "samplingProtocol", req: 1 }, { t: "sampleSizeValue", req: 1 }, { t: "sampleSizeUnit", auto: 1 }, { t: "samplingEffort" },
    { t: "locationID", req: 1 }, { t: "habitat" }, { t: "countryCode", req: 1 }, { t: "stateProvince", req: 1 }, { t: "municipality", req: 1 }, { t: "locality" },
    { t: "decimalLatitude", req: 1 }, { t: "decimalLongitude", req: 1 }, { t: "geodeticDatum", req: 1 }, { t: "coordinateUncertaintyInMeters", req: 1 }, { t: "minimumElevationInMeters" },
    { t: "eventRemarks" },
  ];
  const occurrence = [
    { t: "occurrenceID", req: 1 }, { t: "eventID", req: 1 }, { t: "basisOfRecord", req: 1 }, { t: "occurrenceStatus", req: 1 },
    { t: "scientificName", req: 1 }, { t: "taxonRank", req: 1 }, { t: "identificationQualifier" }, { t: "vernacularName" },
    { t: "class" }, { t: "order" }, { t: "family" },
    { t: "individualCount", req: 1 }, ...(g.coletaInerente ? [] : [{ t: "sex" }]), { t: "lifeStage" },
    ...(sim("marcacao") ? [{ t: "organismID" }] : []),
    ...(coleta ? [{ t: "recordNumber" }, { t: "preparations" }, { t: "institutionCode" }, { t: "catalogNumber" }] : []),
    { t: "recordedBy", req: 1 }, { t: "identifiedBy", req: 1 }, { t: "occurrenceRemarks" },
  ];
  const abas = { event, occurrence };
  if (medidas.length || outraMedida) abas.measurementorfact = [
    { t: "occurrenceID" }, { t: "eventID" }, { t: "measurementType", req: 1 }, { t: "measurementValue", req: 1 }, { t: "measurementUnit", auto: 1 },
    { t: "measurementMethod" }, { t: "measurementDeterminedBy" }, { t: "measurementRemarks" },
  ];
  const metodos = g.metodos.filter((m) => (r.metodos || []).includes(m.c));
  return { gid, grupo: g, abas, medidas, metodos, outroMetodo, outraMedida };
}
function termo(aba, t) { return TERMOS[`${aba}.${t}`] || TERMOS[t]; }

// ---------- Gerador ----------
const N_LINHAS = { event: 1000, occurrence: 5000, measurementorfact: 10000 };
const C = { req: "FF1B4D3E", opt: "FF5C8A7B", auto: "FF8A938F", autoFill: "FFF1F3F2", branco: "FFFFFFFF", erro: "FFF6C9C4" };

function colLetra(i) { let s = ""; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }

async function gerarTemplate(ExcelJS, r) {
  const E = estrutura(r);
  const g = E.grupo;
  const wb = new ExcelJS.Workbook();
  wb.creator = "Gerador de templates Darwin Core (protótipo)";
  wb.calcProperties.fullCalcOnLoad = true;

  const pos = {};
  Object.entries(E.abas).forEach(([aba, cols]) => cols.forEach((c, i) => (pos[`${aba}.${c.t}`] = colLetra(i))));
  const faixa = (aba, t) => `${aba}!$${pos[`${aba}.${t}`]}$2:$${pos[`${aba}.${t}`]}$${N_LINHAS[aba] + 1}`;

  // abas visíveis "protocolos" e "medidas" (com linhas livres quando houver "Outro") e aba oculta "listas" com vocabulários
  const EXTRA = 8;
  const nMet = E.metodos.length + (E.outroMetodo ? EXTRA : 0);
  const nMed = E.medidas.length + (E.outraMedida ? EXTRA : 0);
  const ref = {
    samplingProtocol: `protocolos!$A$2:$A$${nMet + 1}`,
    metodoTabela: `protocolos!$A$2:$B$${nMet + 1}`,
    measurementType: `medidas!$A$2:$A$${Math.max(nMed, 1) + 1}`,
    medidaTabela: `medidas!$A$2:$C$${Math.max(nMed, 1) + 1}`,
  };
  Object.entries(VOCAB).forEach(([k, vals], j) => { const L = colLetra(j); ref[k] = `listas!$${L}$2:$${L}$${vals.length + 1}`; });

  // ---- LEIA-ME ----
  const lm = wb.addWorksheet("LEIA-ME", { properties: { tabColor: { argb: C.req } } });
  lm.getColumn(1).width = 44; lm.getColumn(2).width = 44; lm.getColumn(3).width = 18;
  let L = 1;
  const linha = (vals, estilo) => { const row = lm.getRow(L++); vals.forEach((v, i) => (row.getCell(i + 1).value = v)); if (estilo) estilo(row); return row; };
  const secao = (t) => { L++; linha([t], (row) => (row.getCell(1).font = { bold: true, color: { argb: C.req } })); };
  linha([`Template Darwin Core · ${g.nome}`], (row) => (row.getCell(1).font = { bold: true, size: 16, color: { argb: C.req } }));
  linha(["Passe o mouse sobre o cabeçalho de cada coluna para ver a definição e um exemplo."], (row) => (row.getCell(1).font = { italic: true, color: { argb: "FF555555" } }));
  secao("ORDEM DE PREENCHIMENTO");
  const passos = [["1. event", "Uma linha por amostragem: um método aplicado em um ponto, em uma data." + (r.campanhas === "sim" ? " Cada campanha também é uma linha, sem samplingProtocol." : "")],
    ["2. occurrence", "Uma linha por táxon registrado em cada amostragem. O eventID é escolhido na lista."]];
  if (E.abas.measurementorfact) passos.push(["3. measurementorfact", "Uma linha por medida. Indivíduo: preencha occurrenceID. Ambiente: preencha eventID."]);
  passos.forEach((p) => linha(p, (row) => { row.getCell(1).font = { bold: true }; row.getCell(2).alignment = { wrapText: true, vertical: "top" }; lm.mergeCells(`B${row.number}:C${row.number}`); row.height = 32; }));
  secao("CORES DO CABEÇALHO");
  [["Obrigatório", C.req], ["Recomendado", C.opt], ["Automático: não preencher", C.auto]].forEach(([t, cor]) =>
    linha([t], (row) => { row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: cor } }; row.getCell(1).font = { color: { argb: C.branco }, bold: true }; }));
  linha(["Célula vermelha: ID repetido ou inexistente na aba de origem"], (row) => (row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.erro } }));
  secao("MÉTODOS (samplingProtocol)");
  linha(["samplingProtocol", "Como calcular sampleSizeValue", "sampleSizeUnit"], (row) => (row.font = { bold: true }));
  E.metodos.forEach((m) => linha([m.p, m.e, m.u || "—"]));
  if (E.outroMetodo) linha(["Outros métodos", "Cadastre nas linhas amarelas da aba protocolos antes de usar na aba event."], (row) => (row.getCell(2).font = { italic: true }));
  if (E.abas.measurementorfact) {
    secao("MEDIDAS (measurementType)");
    linha(["measurementType", "Vincular por", "measurementUnit"], (row) => (row.font = { bold: true }));
    E.medidas.forEach((m) => linha([m.n, m.nivel === "eventID" ? "eventID (ambiente)" : "occurrenceID (indivíduo)", m.u]));
    if (E.outraMedida) linha(["Outras medidas", "Cadastre nas linhas amarelas da aba medidas antes de usar na aba measurementorfact."], (row) => (row.getCell(2).font = { italic: true }));
  }

  // ---- Abas de dados ----
  const dvErro = { showErrorMessage: true, errorStyle: "stop", errorTitle: "Valor inválido" };
  function validacao(aba, t, X, n) {
    const lst = (f, msg = "Escolha um valor da lista.") => ({ type: "list", allowBlank: true, formulae: [f], ...dvErro, error: msg });
    if ((aba === "event" && t === "eventID") || (aba === "occurrence" && t === "occurrenceID"))
      return { type: "custom", allowBlank: true, formulae: [`COUNTIF($${X}$2:$${X}$${n + 1},${X}2)=1`], ...dvErro, error: "Este ID já existe na coluna. Cada ID deve ser único." };
    if (t === "eventID" || t === "parentEventID") return lst(faixa("event", "eventID"), "Escolha um eventID já cadastrado na aba event.");
    if (t === "occurrenceID") return lst(faixa("occurrence", "occurrenceID"), "Escolha um occurrenceID já cadastrado na aba occurrence.");
    if (t === "samplingProtocol") return lst(ref.samplingProtocol);
    if (t === "measurementType") return lst(ref.measurementType);
    if (VOCAB[t]) return lst(ref[t]);
    if (t === "eventDate") return { type: "custom", allowBlank: true, formulae: [`AND(MID(${X}2,5,1)="-",MID(${X}2,8,1)="-",OR(LEN(${X}2)=10,AND(LEN(${X}2)=21,MID(${X}2,11,1)="/")))`], ...dvErro, error: "Use AAAA-MM-DD, ou AAAA-MM-DD/AAAA-MM-DD para intervalos." };
    if (t === "decimalLatitude") return { type: "decimal", operator: "between", allowBlank: true, formulae: [-22.95, -14.2], ...dvErro, error: "Latitude fora de Minas Gerais. Use graus decimais negativos (ex.: -20.253412)." };
    if (t === "decimalLongitude") return { type: "decimal", operator: "between", allowBlank: true, formulae: [-51.1, -39.8], ...dvErro, error: "Longitude fora de Minas Gerais. Use graus decimais negativos (ex.: -43.801234)." };
    if (t === "coordinateUncertaintyInMeters" || t === "minimumElevationInMeters") return { type: "whole", operator: "between", allowBlank: true, formulae: [0, 100000], ...dvErro, error: "Use um número inteiro." };
    if (t === "individualCount") return { type: "whole", operator: "between", allowBlank: true, formulae: [0, 1000000], ...dvErro, error: "Use um número inteiro maior ou igual a 0." };
    if (t === "sampleSizeValue") return { type: "decimal", operator: "greaterThanOrEqual", allowBlank: true, formulae: [-1000000], ...dvErro, error: "Use somente o número, sem unidade." };
    return { type: "any", allowBlank: true };
  }
  const formula = {
    sampleSizeUnit: (aba, rw) => `IF(${pos[`${aba}.samplingProtocol`]}${rw}="","",VLOOKUP(${pos[`${aba}.samplingProtocol`]}${rw},${ref.metodoTabela},2,FALSE)&"")`,
    measurementUnit: (aba, rw) => `IF(${pos[`${aba}.measurementType`]}${rw}="","",VLOOKUP(${pos[`${aba}.measurementType`]}${rw},${ref.medidaTabela},2,FALSE)&"")`,
  };
  const texto = new Set(["eventID", "parentEventID", "occurrenceID", "eventDate", "eventTime", "locationID", "organismID", "recordNumber", "catalogNumber"]);
  const vermelho = { fill: { type: "pattern", pattern: "solid", bgColor: { argb: C.erro } } };

  for (const [aba, cols] of Object.entries(E.abas)) {
    const n = N_LINHAS[aba];
    const ws = wb.addWorksheet(aba, { properties: { tabColor: { argb: C.opt } }, views: [{ state: "frozen", xSplit: 1, ySplit: 1 }] });
    ws.columns = cols.map((c) => ({ width: Math.max(14, c.t.length + 5) }));
    const hr = ws.getRow(1); hr.height = 22;
    cols.forEach((c, i) => {
      const [def, como, ex] = termo(aba, c.t);
      const X = colLetra(i);
      const status = c.auto ? "AUTOMÁTICO: não preencher" : c.req ? "OBRIGATÓRIO" : "Recomendado";
      if (texto.has(c.t)) ws.getColumn(i + 1).numFmt = "@";
      if (c.t === "decimalLatitude" || c.t === "decimalLongitude") ws.getColumn(i + 1).numFmt = "0.000000";
      const cell = hr.getCell(i + 1);
      cell.value = c.t;
      cell.numFmt = "General";
      cell.font = { bold: true, color: { argb: C.branco } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: c.auto ? C.auto : c.req ? C.req : C.opt } };
      cell.alignment = { vertical: "middle" };
      cell.note = { texts: [
        { font: { bold: true, size: 10 }, text: `${c.t} · ${status}\n` },
        { font: { size: 9 }, text: `${def}\n` },
        { font: { bold: true, size: 9 }, text: "Como preencher: " }, { font: { size: 9 }, text: `${como}\n` },
        { font: { bold: true, size: 9 }, text: "Exemplo: " }, { font: { size: 9 }, text: ex },
      ] };
      if (c.auto) {
        for (let rw = 2; rw <= n + 1; rw++) {
          const cl = ws.getCell(`${X}${rw}`);
          cl.value = { formula: formula[c.t](aba, rw) };
          cl.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.autoFill } };
          cl.font = { color: { argb: "FF5A625E" } };
        }
      } else {
        const dv = validacao(aba, c.t, X, n);
        Object.assign(dv, { showInputMessage: true, promptTitle: c.t.slice(0, 32), prompt: `${como} Ex.: ${ex}`.slice(0, 250) });
        ws.dataValidations.add(`${X}2:${X}${n + 1}`, dv);
      }
    });

    // destaque: IDs repetidos e IDs inexistentes na aba de origem
    let pr = 1;
    const regra = (ref, expr) => ws.addConditionalFormatting({ ref, rules: [{ type: "expression", priority: pr++, formulae: [expr], style: vermelho }] });
    const proprio = { event: "eventID", occurrence: "occurrenceID" }[aba];
    if (proprio) { const X = pos[`${aba}.${proprio}`]; regra(`${X}2:${X}${n + 1}`, `AND(${X}2<>"",COUNTIF($${X}$2:$${X}$${n + 1},${X}2)>1)`); }
    const orfao = (t, origem) => { const X = pos[`${aba}.${t}`]; if (X) regra(`${X}2:${X}${n + 1}`, `AND(${X}2<>"",COUNTIF(${faixa(origem, origem === "event" ? "eventID" : "occurrenceID")},${X}2)=0)`); };
    if (aba === "event") orfao("parentEventID", "event");
    if (aba === "occurrence") orfao("eventID", "event");
    if (aba === "measurementorfact") {
      orfao("occurrenceID", "occurrence"); orfao("eventID", "event");
      const O = pos["measurementorfact.occurrenceID"], Ev = pos["measurementorfact.eventID"], T = pos["measurementorfact.measurementType"];
      regra(`${O}2:${Ev}${n + 1}`, `AND($${T}2<>"",$${O}2="",$${Ev}2="")`);
      // medida de indivíduo sem occurrenceID, ou medida de ambiente sem eventID
      regra(`${O}2:${O}${n + 1}`, `AND($${T}2<>"",$${O}2="",IFERROR(VLOOKUP($${T}2,${ref.medidaTabela},3,FALSE),"")="occurrenceID")`);
      regra(`${Ev}2:${Ev}${n + 1}`, `AND($${T}2<>"",$${Ev}2="",IFERROR(VLOOKUP($${T}2,${ref.medidaTabela},3,FALSE),"")="eventID")`);
    }
    ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: cols.length } };
  }

  // ---- protocolos e medidas (visíveis, editáveis quando houver "Outro") ----
  const amarelo = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF4C2" } };
  function abaTabela(nome, cabecalhos, larguras, linhas, extras, notaExtra, dvTerceira) {
    const ws = wb.addWorksheet(nome, { properties: { tabColor: { argb: C.auto } }, views: [{ state: "frozen", ySplit: 1 }] });
    ws.columns = larguras.map((w) => ({ width: w }));
    cabecalhos.forEach(([h, nota], i) => {
      const c = ws.getRow(1).getCell(i + 1);
      c.value = h; c.font = { bold: true, color: { argb: C.branco } };
      c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.req } };
      if (nota) c.note = nota;
    });
    linhas.forEach((vals, k) => vals.forEach((v, i) => (ws.getRow(k + 2).getCell(i + 1).value = v)));
    for (let k = 0; k < extras; k++) {
      const row = ws.getRow(linhas.length + 2 + k);
      cabecalhos.forEach((_, i) => (row.getCell(i + 1).fill = amarelo));
    }
    if (extras) {
      ws.getRow(linhas.length + 2).getCell(1).note = notaExtra;
      if (dvTerceira) ws.dataValidations.add(`C${linhas.length + 2}:C${linhas.length + 1 + extras}`, dvTerceira);
    }
    return ws;
  }
  abaTabela("protocolos",
    [["samplingProtocol", "Métodos que aparecem na lista da coluna samplingProtocol (aba event)."], ["sampleSizeUnit", "Unidade de esforço, copiada automaticamente para a aba event."], ["como calcular o esforço", null]],
    [46, 18, 44], E.metodos.map((m) => [m.p, m.u, m.e]), E.outroMetodo ? EXTRA : 0,
    "Linhas amarelas: cadastre aqui métodos não listados (nome, unidade de esforço e como calcular). Depois eles aparecem na lista de samplingProtocol.");
  if (E.abas.measurementorfact) abaTabela("medidas",
    [["measurementType", "Medidas que aparecem na lista da coluna measurementType (aba measurementorfact)."], ["measurementUnit", "Unidade, copiada automaticamente para a aba measurementorfact."], ["vincular por", "occurrenceID = medida do indivíduo; eventID = medida do ambiente."]],
    [36, 18, 16], E.medidas.map((m) => [m.n, m.u, m.nivel]), E.outraMedida ? EXTRA : 0,
    "Linhas amarelas: cadastre aqui medidas não listadas (nome, unidade e se é do indivíduo ou do ambiente). Depois elas aparecem na lista de measurementType.",
    { type: "list", allowBlank: true, formulae: ['"occurrenceID,eventID"'], showErrorMessage: true, error: "Escolha occurrenceID ou eventID." });

  // ---- listas de vocabulário (oculta) ----
  const ls = wb.addWorksheet("listas", { state: "hidden" });
  Object.entries(VOCAB).forEach(([k, vals], j) => { ls.getRow(1).getCell(1 + j).value = k; vals.forEach((v, i) => (ls.getRow(i + 2).getCell(1 + j).value = v)); });

  // ---- metadados para o futuro validador ----
  const cf = wb.addWorksheet("_config", { state: "veryHidden" });
  cf.getCell("A1").value = JSON.stringify({ versao: VERSAO_MODELO, gerado: new Date().toISOString(), respostas: r,
    abas: Object.fromEntries(Object.entries(E.abas).map(([a, cs]) => [a, cs.map((c) => c.t)])), metodos: E.metodos, medidas: E.medidas });
  wb.views = [{ activeTab: 0 }];
  return wb;
}

// O ExcelJS cria caixas de comentário pequenas; aqui elas são ampliadas
async function ampliarComentarios(JSZip, buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const vmls = Object.keys(zip.files).filter((f) => /xl\/drawings\/vmlDrawing\d*\.vml$/.test(f));
  for (const f of vmls) {
    let x = await zip.file(f).async("string");
    x = x.replace(/<x:Anchor>([^<]*)<\/x:Anchor>/g, (m, s) => {
      const [l] = s.split(",").map((v) => parseInt(v, 10));
      return `<x:Anchor>${l}, 10, 1, 4, ${l + 4}, 10, 12, 4</x:Anchor>`;
    });
    x = x.replace(/width:[\d.]+pt;height:[\d.]+pt/g, "width:260pt;height:150pt");
    zip.file(f, x);
  }
  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}

if (typeof module !== "undefined") module.exports = { GRUPOS, NOS, fluxo, podar, estrutura, grupoFinal, gerarTemplate, ampliarComentarios, OUTRO };
