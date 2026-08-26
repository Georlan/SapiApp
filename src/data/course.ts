export type QuestionOption = {
  id: string;
  label: string;
};

export type Question = {
  id: string;
  prompt: string;
  options: QuestionOption[];
  answerId: string;
  explanation: string;
};

export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  xp: number;
  isCheckpoint?: boolean;
  questions: Question[];
};

export const lessons: Lesson[] = [
  {
    id: 'proporcoes',
    title: 'Proporções',
    subtitle: 'Compare grandezas sem decorar regras',
    emoji: '⚖️',
    xp: 60,
    questions: [
      {
        id: 'p1',
        prompt: 'No mercado, 2 kg de arroz custam R$ 14. Mantendo o mesmo preço por kg, quanto custariam 5 kg?',
        options: [
          { id: 'a', label: 'R$ 28' },
          { id: 'b', label: 'R$ 32' },
          { id: 'c', label: 'R$ 35' },
          { id: 'd', label: 'R$ 42' },
        ],
        answerId: 'c',
        explanation: '2 kg custam R$14, então 1 kg custa R$7. Para 5 kg: 5 × 7 = R$35.',
      },
      {
        id: 'p2',
        prompt: 'Uma receita para 4 pessoas usa 300 g de farinha. Para 10 pessoas, mantendo a proporção, quantos gramas são necessários?',
        options: [
          { id: 'a', label: '600 g' },
          { id: 'b', label: '700 g' },
          { id: 'c', label: '750 g' },
          { id: 'd', label: '900 g' },
        ],
        answerId: 'c',
        explanation: '10 pessoas representam 2,5 vezes 4 pessoas. Então 300 × 2,5 = 750 g.',
      },
      {
        id: 'p3',
        prompt: 'Um carro percorre 180 km com 15 L. Se o consumo médio não mudar, quantos litros serão necessários para 300 km?',
        options: [
          { id: 'a', label: '20 L' },
          { id: 'b', label: '25 L' },
          { id: 'c', label: '30 L' },
          { id: 'd', label: '35 L' },
        ],
        answerId: 'b',
        explanation: 'O carro faz 180 ÷ 15 = 12 km/L. Para 300 km: 300 ÷ 12 = 25 L.',
      },
      {
        id: 'p4',
        prompt: '6 máquinas iguais produzem um lote em 8 horas. Se 12 máquinas trabalharem no mesmo ritmo, quanto tempo levarão?',
        options: [
          { id: 'a', label: '2 h' },
          { id: 'b', label: '4 h' },
          { id: 'c', label: '8 h' },
          { id: 'd', label: '16 h' },
        ],
        answerId: 'b',
        explanation: 'Dobrar o número de máquinas reduz o tempo pela metade: 8 ÷ 2 = 4 horas. É uma proporção inversa.',
      },
      {
        id: 'p5',
        prompt: 'Uma tela tem razão largura:altura de 16:9. Se a largura for 160 cm, qual será a altura?',
        options: [
          { id: 'a', label: '80 cm' },
          { id: 'b', label: '90 cm' },
          { id: 'c', label: '100 cm' },
          { id: 'd', label: '120 cm' },
        ],
        answerId: 'b',
        explanation: '160 corresponde a 16 partes, então cada parte vale 10 cm. A altura é 9 × 10 = 90 cm.',
      },
    ],
  },
  {
    id: 'porcentagem',
    title: 'Porcentagem',
    subtitle: 'Descontos, aumentos e comparações',
    emoji: '📈',
    xp: 70,
    questions: [
      {
        id: 'c1',
        prompt: 'Um tênis de R$ 240 está com 25% de desconto. Qual é o preço final?',
        options: [
          { id: 'a', label: 'R$ 160' },
          { id: 'b', label: 'R$ 180' },
          { id: 'c', label: 'R$ 190' },
          { id: 'd', label: 'R$ 200' },
        ],
        answerId: 'b',
        explanation: '25% é 1/4. Um quarto de R$240 é R$60. Logo, 240 − 60 = R$180.',
      },
      {
        id: 'c2',
        prompt: 'Um produto sobe de R$ 100 para R$ 120 e depois recebe 20% de desconto. Qual é o preço final?',
        options: [
          { id: 'a', label: 'R$ 96' },
          { id: 'b', label: 'R$ 100' },
          { id: 'c', label: 'R$ 104' },
          { id: 'd', label: 'R$ 108' },
        ],
        answerId: 'a',
        explanation: 'O desconto é aplicado sobre R$120: 20% de 120 = 24. Então 120 − 24 = R$96.',
      },
      {
        id: 'c3',
        prompt: 'Em uma turma de 40 alunos, 30 foram aprovados. Qual foi a porcentagem de aprovação?',
        options: [
          { id: 'a', label: '60%' },
          { id: 'b', label: '70%' },
          { id: 'c', label: '75%' },
          { id: 'd', label: '80%' },
        ],
        answerId: 'c',
        explanation: '30 ÷ 40 = 0,75. Multiplicando por 100, temos 75%.',
      },
      {
        id: 'c4',
        prompt: 'A bateria do celular caiu de 80% para 60%. Essa queda corresponde a quantos por cento do valor inicial de carga?',
        options: [
          { id: 'a', label: '20%' },
          { id: 'b', label: '25%' },
          { id: 'c', label: '30%' },
          { id: 'd', label: '40%' },
        ],
        answerId: 'b',
        explanation: 'A queda foi de 20 pontos sobre um valor inicial de 80. Assim, 20 ÷ 80 = 0,25 = 25%.',
      },
      {
        id: 'c5',
        prompt: 'Uma população de 20 mil habitantes cresce 10%. Quantos habitantes passa a ter?',
        options: [
          { id: 'a', label: '20.200' },
          { id: 'b', label: '21.000' },
          { id: 'c', label: '22.000' },
          { id: 'd', label: '24.000' },
        ],
        answerId: 'c',
        explanation: '10% de 20.000 é 2.000. Somando ao valor inicial: 22.000 habitantes.',
      },
    ],
  },
  {
    id: 'pressao',
    title: 'Pressão',
    subtitle: 'Entenda força e área no mundo real',
    emoji: '🔩',
    xp: 80,
    questions: [
      {
        id: 'f1',
        prompt: 'A mesma força é aplicada em duas superfícies. Se a área de contato cair pela metade, o que acontece com a pressão?',
        options: [
          { id: 'a', label: 'Cai pela metade' },
          { id: 'b', label: 'Não muda' },
          { id: 'c', label: 'Dobra' },
          { id: 'd', label: 'Quadruplica' },
        ],
        answerId: 'c',
        explanation: 'P = F/A. Com a mesma força e metade da área, dividimos pela metade e a pressão dobra.',
      },
      {
        id: 'f2',
        prompt: 'Por que uma faca bem afiada corta com mais facilidade, considerando a mesma força aplicada?',
        options: [
          { id: 'a', label: 'Ela aumenta a massa do objeto' },
          { id: 'b', label: 'Ela concentra a força em uma área menor' },
          { id: 'c', label: 'Ela reduz a força aplicada' },
          { id: 'd', label: 'Ela elimina o atrito' },
        ],
        answerId: 'b',
        explanation: 'Uma lâmina fina reduz a área de contato. Para a mesma força, isso aumenta a pressão sobre o material.',
      },
      {
        id: 'f3',
        prompt: 'Uma força de 200 N atua uniformemente sobre uma área de 0,5 m². Qual é a pressão?',
        options: [
          { id: 'a', label: '100 Pa' },
          { id: 'b', label: '200 Pa' },
          { id: 'c', label: '400 Pa' },
          { id: 'd', label: '800 Pa' },
        ],
        answerId: 'c',
        explanation: 'P = F/A = 200/0,5 = 400 Pa.',
      },
      {
        id: 'f4',
        prompt: 'Em um sistema hidráulico ideal, uma pressão aplicada a um fluido confinado é transmitida:',
        options: [
          { id: 'a', label: 'Somente para baixo' },
          { id: 'b', label: 'Somente para o pistão maior' },
          { id: 'c', label: 'Igualmente em todas as direções' },
          { id: 'd', label: 'Apenas se o fluido estiver em movimento' },
        ],
        answerId: 'c',
        explanation: 'Esse é o princípio de Pascal: uma variação de pressão em um fluido confinado é transmitida integralmente em todas as direções.',
      },
      {
        id: 'f5',
        prompt: 'Por que um salto fino tende a afundar mais em um gramado do que um tênis, para a mesma pessoa?',
        options: [
          { id: 'a', label: 'Porque o salto diminui o peso' },
          { id: 'b', label: 'Porque o salto exerce menor pressão' },
          { id: 'c', label: 'Porque a área menor aumenta a pressão' },
          { id: 'd', label: 'Porque o tênis aumenta a gravidade' },
        ],
        answerId: 'c',
        explanation: 'O peso é praticamente o mesmo, mas a área de contato do salto é muito menor. Logo, a pressão é maior.',
      },
    ],
  },
  {
    id: 'checkpoint-1',
    title: 'Checkpoint',
    subtitle: 'Prove que dominou a primeira etapa',
    emoji: '🏆',
    xp: 120,
    isCheckpoint: true,
    questions: [
      {
        id: 'k1',
        prompt: '3 cadernos custam R$ 27. Quanto custam 7 cadernos ao mesmo preço unitário?',
        options: [
          { id: 'a', label: 'R$ 54' },
          { id: 'b', label: 'R$ 63' },
          { id: 'c', label: 'R$ 72' },
          { id: 'd', label: 'R$ 81' },
        ],
        answerId: 'b',
        explanation: 'Cada caderno custa R$9. Então 7 × 9 = R$63.',
      },
      {
        id: 'k2',
        prompt: 'Um valor de R$ 500 aumenta 12%. Qual é o novo valor?',
        options: [
          { id: 'a', label: 'R$ 512' },
          { id: 'b', label: 'R$ 540' },
          { id: 'c', label: 'R$ 560' },
          { id: 'd', label: 'R$ 620' },
        ],
        answerId: 'c',
        explanation: '12% de 500 = 60. Então o novo valor é R$560.',
      },
      {
        id: 'k3',
        prompt: 'Mantendo a força constante, aumentar a área de contato 4 vezes faz a pressão:',
        options: [
          { id: 'a', label: 'Aumentar 4 vezes' },
          { id: 'b', label: 'Dobrar' },
          { id: 'c', label: 'Cair à metade' },
          { id: 'd', label: 'Cair para 1/4' },
        ],
        answerId: 'd',
        explanation: 'Como P = F/A, quadruplicar a área mantendo a força reduz a pressão para um quarto.',
      },
      {
        id: 'k4',
        prompt: 'Um mapa usa escala 1:50.000. Uma distância de 4 cm no mapa corresponde a quantos quilômetros reais?',
        options: [
          { id: 'a', label: '0,5 km' },
          { id: 'b', label: '1 km' },
          { id: 'c', label: '2 km' },
          { id: 'd', label: '20 km' },
        ],
        answerId: 'c',
        explanation: '4 × 50.000 = 200.000 cm = 2.000 m = 2 km.',
      },
      {
        id: 'k5',
        prompt: 'Uma loja oferece 30% de desconto em um produto de R$ 150. Quanto o cliente economiza?',
        options: [
          { id: 'a', label: 'R$ 30' },
          { id: 'b', label: 'R$ 35' },
          { id: 'c', label: 'R$ 45' },
          { id: 'd', label: 'R$ 50' },
        ],
        answerId: 'c',
        explanation: '30% de 150 = 0,30 × 150 = R$45.',
      },
      {
        id: 'k6',
        prompt: 'Um pistão transmite pressão a um fluido confinado. Qual princípio físico descreve esse comportamento?',
        options: [
          { id: 'a', label: 'Princípio de Pascal' },
          { id: 'b', label: 'Lei de Ohm' },
          { id: 'c', label: 'Lei de Snell' },
          { id: 'd', label: 'Princípio de Arquimedes' },
        ],
        answerId: 'a',
        explanation: 'O princípio de Pascal descreve a transmissão da pressão em fluidos confinados.',
      },
    ],
  },
];
