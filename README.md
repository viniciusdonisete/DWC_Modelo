# Template Darwin Core para dados de fauna

Site que gera planilhas modelo (.xlsx) no padrão Darwin Core para estudos de fauna, a partir de um questionário em árvore de decisão.

**Acesse:** `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

## Como funciona

1. O usuário responde perguntas de múltipla escolha: meio, grupo, forma de registro, métodos, campanhas, biometria, marcação, coleta e variáveis ambientais.
2. A árvore de decisão mostra apenas as opções relevantes para cada resposta.
3. O site gera a planilha no próprio navegador. Nenhum dado é enviado a servidor.

## A planilha gerada

| Aba | Conteúdo |
|---|---|
| `LEIA-ME` | Ordem de preenchimento, cores, métodos e medidas do estudo |
| `event` | Uma linha por amostragem (Event core) |
| `occurrence` | Uma linha por táxon por amostragem |
| `measurementorfact` | Uma linha por medida (só se houver biometria ou variáveis ambientais) |
| `protocolos` | Métodos da lista `samplingProtocol`; linhas amarelas para métodos não listados |
| `medidas` | Medidas da lista `measurementType`; linhas amarelas para medidas não listadas |

- Cabeçalhos com os termos Darwin Core, com comentário (definição, como preencher, exemplo).
- Listas suspensas com vocabulários controlados e com os IDs das outras abas.
- IDs repetidos ou inexistentes ficam em vermelho.
- `sampleSizeUnit` e `measurementUnit` são preenchidos automaticamente.
- Aba oculta `_config` com as respostas do questionário, para o futuro validador.

## Como editar

O conteúdo fica em `src/gen.js`:

- `GRUPOS`: grupos, métodos (`samplingProtocol`, unidade e cálculo de esforço) e medidas.
- `AMB_TERRESTRE` / `AMB_AQUATICO`: variáveis ambientais.
- `VOCAB`: listas suspensas (basisOfRecord, sex, lifeStage, habitat…).
- `TERMOS`: textos dos comentários de cada coluna.
- `NOS` e `fluxo()`: perguntas e a lógica da árvore de decisão.

Depois de editar, rode `python src/build.py` para atualizar o `index.html`.
Sem Python, também dá para editar o `index.html` diretamente: o conteúdo de `gen.js` está copiado dentro dele.

## Bibliotecas

[d3.js](https://d3js.org) 7.9.0, [ExcelJS](https://github.com/exceljs/exceljs) 4.4.0 e [JSZip](https://stuk.github.io/jszip/) 3.10.1, carregadas do cdnjs.

## Próximas etapas

- Validação do upload das planilhas preenchidas
- Estatísticas descritivas para conferência
- Unificação de vários estudos e exportação DwC-A
