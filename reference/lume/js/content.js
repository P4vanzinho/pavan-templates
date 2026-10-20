export const image = key => `/assets/images/${key}.webp`;
export const photos = {
  vento:{alt:'Retrato de uma mulher à luz do entardecer, entre falésias e o mar.',label:'Entre o vento e a luz'},
  casamento:{alt:'Casal abraçado em um jardim de pedra iluminado pelo pôr do sol.',label:'Maia & Tomás'},
  detalhes:{alt:'Buquê branco, alianças e tecido de seda sob sombras de oliveiras.',label:'O amor nos detalhes'},
  arquitetura:{alt:'Casa de formas curvas e materiais naturais banhada por luz dourada.',label:'A casa e o tempo'},
  retrato:{alt:'Retrato em preto e branco de uma mulher em luz suave de janela.',label:'O que o olhar diz'},
  cotidiano:{alt:'Amigos rindo juntos em uma mesa de café na rua.',label:'Dias lá fora'},
  editorial:{alt:'Editorial de moda em um espaço de pedra com luz geométrica.',label:'Matéria de luz'},
  clara:{alt:'Clara, fotógrafa fictícia, com uma câmera em um estúdio claro.',label:'Clara Mota'},
};
export const categories = [
  {slug:'todos',label:'Todos os olhares',title:'Histórias que merecem ficar.',description:'Um pouco do que vejo, um pouco do que sinto. Explore as histórias e encontre a sua.',cover:'vento'},
  {slug:'retratos',label:'Retratos',title:'O que existe por trás do olhar.',description:'Presença, personalidade e um jeito muito seu de estar no mundo. Retratos sem pressa, sem personagens.',cover:'retrato'},
  {slug:'casamentos',label:'Histórias de amor',title:'O amor mora nos intervalos.',description:'O abraço antes da cerimônia. O riso fora do roteiro. Aquilo que só acontece uma vez.',cover:'casamento'},
  {slug:'editorial',label:'Editorial',title:'Luz, intenção e um pouco de ousadia.',description:'Imagens para marcas e histórias que têm algo a dizer. Um olhar autoral, da ideia à última fotografia.',cover:'editorial'},
  {slug:'espacos',label:'Espaços',title:'Lugares também contam histórias.',description:'Arquitetura, detalhes e a luz que transforma um espaço em experiência. Fotografia para sentir os lugares.',cover:'arquitetura'},
];
export const categoryURL = slug => slug==='todos'?'/portfolio':`/portfolio/${slug}`;
export const projects = [
  {slug:'entre-o-vento-e-a-luz',title:'Entre o vento e a luz',category:'retratos',cover:'vento',year:'2026',place:'À beira-mar',kind:'Ensaio autoral',description:'Um encontro com o vento, a luz de fim de tarde e a liberdade de ser. O cenário muda. A presença fica.',gallery:['vento','editorial','retrato'],featured:true},
  {slug:'maia-e-tomas',title:'Maia & Tomás',category:'casamentos',cover:'casamento',year:'2026',place:'Um jardim, um sim',kind:'Celebração intimista',description:'Um dia feito de pequenos gestos. Entre oliveiras, abraços e a luz que demorou a ir embora, uma história de amor encontrou suas imagens.',gallery:['casamento','detalhes'],featured:true},
  {slug:'a-casa-e-o-tempo',title:'A casa e o tempo',category:'espacos',cover:'arquitetura',year:'2025',place:'Casa de luz',kind:'Arquitetura & interiores',description:'Paredes que acolhem, texturas que convidam e a passagem delicada da luz. Uma leitura sensível do espaço e de seus silêncios.',gallery:['arquitetura'],featured:true},
  {slug:'materia-de-luz',title:'Matéria de luz',category:'editorial',cover:'editorial',year:'2026',place:'Estúdio',kind:'Moda & narrativa visual',description:'Cor, forma e movimento em uma conversa com a arquitetura. Um editorial sobre a beleza de ocupar o próprio espaço.',gallery:['editorial','vento'],featured:true},
  {slug:'o-que-o-olhar-diz',title:'O que o olhar diz',category:'retratos',cover:'retrato',year:'2025',place:'Luz de janela',kind:'Retrato em preto e branco',description:'Quando a cor se cala, o olhar fala. Uma série sobre expressão, textura e a simplicidade de um encontro verdadeiro.',gallery:['retrato','vento'],featured:false},
  {slug:'dias-la-fora',title:'Dias lá fora',category:'editorial',cover:'cotidiano',year:'2025',place:'Pelas ruas',kind:'Lifestyle & cotidiano',description:'Um café que se alonga, uma conversa boa, a cidade ao fundo. Imagens sobre os dias comuns que a gente quer lembrar.',gallery:['cotidiano','arquitetura'],featured:false},
];
export const experiences = [
 {title:'Retratos com presença',text:'Um ensaio pensado para você se sentir à vontade. Conversamos sobre a sua história, escolhemos a luz e deixamos o resto acontecer.',details:'Direção leve · Estúdio ou locação · Galeria para seleção',type:'retratos'},
 {title:'Histórias de amor',text:'Celebrações pequenas ou dias cheios de gente: um olhar atento ao que é espontâneo, aos encontros e aos detalhes que fazem a história de vocês.',details:'Planejamento do dia · Cobertura autoral · Galeria compartilhável',type:'casamentos'},
 {title:'Imagens para marcas',text:'Construímos uma narrativa visual com intenção. Da referência ao set, cada decisão conversa com a personalidade da sua marca.',details:'Conceito visual · Produção editorial · Imagens para campanha',type:'editorial'},
 {title:'Arquitetura que se sente',text:'Um olhar para o desenho, os materiais e a vida que existe entre eles. A luz é parte do projeto, e a imagem também.',details:'Estudo de luz · Interiores e detalhes · Curadoria visual',type:'espacos'},
];
export const faq = [
 {q:'Preciso saber posar?',a:'Não. A direção faz parte da experiência. Começamos com uma conversa, encontramos um ritmo confortável e construímos o ensaio juntos. A ideia é que você se reconheça nas imagens.'},
 {q:'Como escolhemos a locação?',a:'Pensamos no que faz sentido para a sua história: sua casa, uma rua que você gosta, um cenário natural ou um estúdio. Luz, atmosfera e conforto guiam a escolha.'},
 {q:'Como recebo minhas fotos?',a:'Em uma galeria organizada, com visualização em tela cheia e seleção de favoritas. Você pode conhecer esse formato na galeria demonstrativa do site.'},
 {q:'Você fotografa fora de Curitiba?',a:'Sim. A proposta do ensaio pode incluir outras cidades. Distâncias, horários e produção são alinhados na conversa inicial.'},
];
export const routes = ['/', '/portfolio', ...categories.slice(1).map(c=>categoryURL(c.slug)), '/sobre', '/contato', '/galeria', '/privacidade', ...projects.map(p=>`/ensaio/${p.slug}`)];
