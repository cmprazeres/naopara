/* ===========================================================
   NÃO PARA — artigos (PT / EN). Lê window.NP_LANG.
   window.NP_ARTICLES (lista) ; window.NP_getArticle(slug)
   =========================================================== */
(function () {
  "use strict";
  var EN = (window.NP_LANG === "en");

  var CAT = {
    treino: { pt: "Treino", en: "Training" },
    equipamento: { pt: "Equipamento", en: "Gear" },
    recuperacao: { pt: "Recuperação", en: "Recovery" },
    mente: { pt: "Mente", en: "Mind" }
  };

  var A = {
    "regra-10-porcento": {
      cat: "treino", min: 11, img: "hero.png", pos: "center 30%", date: "2026-05-28",
      pt: {
        title: "A regra dos 10%: o erro que trava (quase) todos os corredores",
        dek: "Aumentar volume demasiado depressa é a causa nº1 de lesões. Explicamos como crescer em segurança e quando podes — mesmo — acelerar.",
        body: [
          ["", "Quase todas as lesões de corrida têm a mesma origem: fazer demasiado, demasiado cedo. A regra dos 10% existe precisamente para te proteger de ti próprio nos meses de mais entusiasmo."],
          ["O que diz a regra", "Não aumentes o teu volume semanal total em mais de 10% de uma semana para a seguinte. Se correste 30 km esta semana, a próxima não deve passar muito dos 33 km. Simples, conservador e eficaz."],
          ["Porque funciona", "Os músculos adaptam-se depressa, mas os tendões, ligamentos e ossos precisam de semanas a meses para acompanhar. É o salto súbito de carga — não a distância em si — que provoca a maioria das lesões por sobrecarga."],
          ["Como aplicá-la na prática", "Sobe o volume durante três semanas e alivia na quarta, reduzindo 20–30%. Estas semanas de descarga deixam o corpo consolidar os ganhos e chegam ao mês seguinte mais forte, não mais cansado."],
          ["Quando podes acelerar", "Com uma base sólida, sem dores e bem descansado, podes pontualmente ousar um pouco mais. Mas na dúvida, sê paciente: a consistência ao longo dos meses bate sempre a pressa de uma semana."]
        ]
      },
      en: {
        title: "The 10% rule: the mistake that holds back (almost) every runner",
        dek: "Ramping up volume too fast is the #1 cause of injury. We explain how to grow safely and when you can — really — push.",
        body: [
          ["", "Almost every running injury shares the same root: doing too much, too soon. The 10% rule exists precisely to protect you from yourself during the most enthusiastic months."],
          ["What the rule says", "Don't increase your total weekly volume by more than 10% from one week to the next. If you ran 30 km this week, next week shouldn't go far beyond 33 km. Simple, conservative and effective."],
          ["Why it works", "Muscles adapt quickly, but tendons, ligaments and bones need weeks to months to catch up. It's the sudden jump in load — not the distance itself — that causes most overuse injuries."],
          ["How to apply it", "Build volume for three weeks, then ease off in the fourth, cutting 20–30%. These down weeks let the body lock in the gains, so you start the next month stronger, not more tired."],
          ["When you can push", "With a solid base, no niggles and good rest, you can occasionally dare a little more. But when in doubt, be patient: consistency over months always beats one week's hurry."]
        ]
      }
    },
    "tenis-certo": {
      cat: "equipamento", min: 6, img: "shoes.png", pos: "center 50%", date: "2026-05-22",
      pt: {
        title: "Como escolher o ténis certo para o teu tipo de passada",
        dek: "Drop, amortecimento e pisada. O guia para não errares na próxima compra.",
        body: [
          ["", "O ténis certo não é o mais caro nem o mais badalado — é o que se ajusta ao teu pé, à tua passada e ao tipo de corrida que fazes. Três conceitos ajudam-te a decidir."],
          ["Drop e amortecimento", "O drop é a diferença de altura entre o calcanhar e a ponta. Drops mais altos (8–12 mm) tendem a aliviar o tendão de Aquiles; mais baixos (0–6 mm) exigem mais da perna. O amortecimento é preferência e distância: mais para longões, menos para velocidade."],
          ["Pisada e estabilidade", "Esquece o mito de que precisas de corrigir tudo. A maioria dos corredores corre bem com um ténis neutro. Só quem tem uma pronação acentuada e histórico de lesões beneficia de um modelo de estabilidade."],
          ["Prova antes de decidir", "Experimenta ao fim do dia, com as meias de corrida, e deixa um dedo de folga à frente. Se possível, corre alguns metros na loja. O ténis certo sente-se bem desde o primeiro passo — não precisa de ser 'amaciado'."]
        ]
      },
      en: {
        title: "How to choose the right shoe for your foot strike",
        dek: "Drop, cushioning and pronation. The guide to nailing your next purchase.",
        body: [
          ["", "The right shoe isn't the most expensive or the most hyped — it's the one that fits your foot, your stride and the kind of running you do. Three ideas help you decide."],
          ["Drop and cushioning", "Drop is the height difference between heel and toe. Higher drops (8–12 mm) tend to ease the Achilles; lower ones (0–6 mm) ask more of the leg. Cushioning is preference and distance: more for long runs, less for speed."],
          ["Pronation and stability", "Forget the myth that you need to correct everything. Most runners do well in a neutral shoe. Only those with marked overpronation and an injury history benefit from a stability model."],
          ["Try before you decide", "Try them on at the end of the day, with running socks, leaving a thumb's width at the front. If you can, run a few metres in the shop. The right shoe feels good from the first step — it shouldn't need 'breaking in'."]
        ]
      }
    },
    "zonas-fc": {
      cat: "treino", min: 8, img: "track.png", pos: "center 30%", date: "2026-05-18",
      pt: {
        title: "Zonas de frequência cardíaca: corre no ritmo certo",
        dek: "Porque correr devagar te faz, afinal, correr mais rápido nas provas.",
        body: [
          ["", "A maioria dos corredores corre sempre ao mesmo ritmo: nem fácil, nem rápido. As zonas de frequência cardíaca dão-te um mapa para correres com intenção."],
          ["As cinco zonas", "Da Zona 1 (muito leve) à Zona 5 (máximo), cada uma treina um sistema diferente. O grande segredo está na Zona 2 — confortável, a conversar — onde se constrói a base aeróbica que sustenta tudo o resto."],
          ["A regra 80/20", "Os melhores corredores do mundo correm cerca de 80% do volume em ritmo fácil e só 20% em intensidade. Correr devagar a maior parte do tempo é o que te permite correr verdadeiramente rápido quando é preciso."],
          ["Como medir", "Um monitor de frequência cardíaca ajuda, mas o teste da conversa chega: se consegues falar em frases completas, estás em ritmo fácil. Se só dizes palavras soltas, subiste de zona."]
        ]
      },
      en: {
        title: "Heart-rate zones: run at the right pace",
        dek: "Because running slow actually makes you run faster on race day.",
        body: [
          ["", "Most runners run at the same pace every time: neither easy nor fast. Heart-rate zones give you a map to run with intent."],
          ["The five zones", "From Zone 1 (very light) to Zone 5 (maximal), each trains a different system. The real secret is Zone 2 — comfortable, conversational — where you build the aerobic base that supports everything else."],
          ["The 80/20 rule", "The best runners in the world run about 80% of their volume easy and only 20% hard. Running slow most of the time is exactly what lets you run truly fast when it counts."],
          ["How to measure", "A heart-rate monitor helps, but the talk test is enough: if you can speak in full sentences, you're easy. If you can only manage single words, you've moved up a zone."]
        ]
      }
    },
    "24-horas-longao": {
      cat: "recuperacao", min: 5, img: "nutrition.png", pos: "center 40%", date: "2026-05-12",
      pt: {
        title: "As 24 horas depois de um longão",
        dek: "Sono, hidratação e nutrição — recuperar também é treinar.",
        body: [
          ["", "O longão não termina quando paras o relógio. As 24 horas seguintes decidem se chegas à próxima semana mais forte ou esgotado."],
          ["Os primeiros 60 minutos", "Repõe energia e fluidos cedo: uma combinação de hidratos e proteína (cerca de 3:1) ajuda a reabastecer o glicogénio e a reparar o músculo. Bebe a sede, juntando sal se transpiraste muito."],
          ["Movimento e sono", "Uma caminhada leve ou mobilidade suave ajuda a circulação mais do que ficar sentado. Mas é durante o sono que a verdadeira adaptação acontece — prioriza-o na noite a seguir a um esforço longo."],
          ["O dia seguinte", "Descanso ou um trote muito fácil de recuperação. Se as pernas continuam pesadas ao segundo dia, não forces: ouvir o corpo agora poupa-te semanas de paragem mais tarde."]
        ]
      },
      en: {
        title: "The 24 hours after a long run",
        dek: "Sleep, hydration and nutrition — recovering is training too.",
        body: [
          ["", "The long run doesn't end when you stop the watch. The next 24 hours decide whether you reach the following week stronger or drained."],
          ["The first 60 minutes", "Replace energy and fluids early: a mix of carbs and protein (around 3:1) helps refill glycogen and repair muscle. Drink to thirst, adding salt if you sweated heavily."],
          ["Movement and sleep", "A gentle walk or easy mobility helps circulation more than sitting still. But it's during sleep that real adaptation happens — prioritise it the night after a long effort."],
          ["The next day", "Rest or a very easy recovery jog. If your legs are still heavy on the second day, don't force it: listening to your body now saves you weeks off later."]
        ]
      }
    },
    "muro-km30": {
      cat: "mente", min: 7, img: "hero.png", pos: "center 55%", date: "2026-05-06",
      pt: {
        title: "O muro ao km 30 é mental? A ciência responde",
        dek: "Estratégias para gerires o desconforto e não desistires.",
        body: [
          ["", "Quem já correu uma maratona conhece o 'muro': aquele ponto, por volta do km 30, em que o corpo grita para parar. Mas quanto disto é físico e quanto é cabeça?"],
          ["A parte física", "O muro tem uma base real: as reservas de glicogénio esgotam-se ao fim de 90–120 minutos de esforço. Por isso a estratégia de nutrição em prova é tão decisiva — alimentar cedo e com regularidade adia o muro."],
          ["A parte mental", "Mas o cérebro também trava antes de o corpo falhar a sério, como mecanismo de proteção. Treinar a mente — dividir a prova em troços, usar mantras, focar no próximo quilómetro — ajuda-te a ir mais longe do que pensavas."],
          ["Treinar o muro", "Longões com a parte final a ritmo de prova e alguns treinos com depósitos mais baixos ensinam o corpo e a mente a lidar com o desconforto. No dia D, já lá estiveste antes."]
        ]
      },
      en: {
        title: "Is the wall at km 30 mental? The science answers",
        dek: "Strategies to manage discomfort and not give up.",
        body: [
          ["", "Anyone who has run a marathon knows 'the wall': that point, around km 30, where the body screams to stop. But how much of it is physical and how much is in your head?"],
          ["The physical part", "The wall has a real basis: glycogen stores run out after 90–120 minutes of effort. That's why race nutrition is so decisive — fuelling early and regularly pushes the wall back."],
          ["The mental part", "But the brain also brakes before the body truly fails, as a protective mechanism. Training the mind — breaking the race into chunks, using mantras, focusing on the next kilometre — helps you go further than you thought."],
          ["Training the wall", "Long runs that finish at race pace, plus a few sessions on lower fuel, teach body and mind to handle discomfort. On race day, you've been there before."]
        ]
      }
    },
    "treino-limiar": {
      cat: "treino", min: 9, img: "track.png", pos: "center 70%", date: "2026-04-29",
      pt: {
        title: "Treino de limiar: o segredo para correres mais rápido",
        dek: "O que é, como medir e quanto deves incluir na tua semana.",
        body: [
          ["", "Se só pudesses acrescentar um tipo de treino à tua semana, seria este. O treino de limiar é o que separa quem estagna de quem continua a melhorar."],
          ["O que é o limiar", "É o ritmo a que o teu corpo começa a acumular lactato mais depressa do que consegue eliminá-lo — 'confortavelmente difícil', um esforço que aguentas cerca de uma hora. Treinar aqui empurra esse limite para mais rápido."],
          ["Como treinar", "Blocos contínuos de 20 minutos, ou repetições de 8–10 minutos com curta recuperação, a esse ritmo controlado. Uma sessão por semana é suficiente para a maioria dos corredores."],
          ["O erro comum", "Correr demasiado rápido. O limiar não é um esforço all-out — se acabas destruído, foste demasiado depressa. Bem feito, deve deixar-te a sentir que podias ter feito mais um bloco."]
        ]
      },
      en: {
        title: "Threshold training: the secret to running faster",
        dek: "What it is, how to measure it and how much to include in your week.",
        body: [
          ["", "If you could only add one type of session to your week, this would be it. Threshold training is what separates those who plateau from those who keep improving."],
          ["What threshold is", "It's the pace at which your body starts to build up lactate faster than it can clear it — 'comfortably hard', an effort you could hold for about an hour. Training here pushes that limit to a faster pace."],
          ["How to train it", "Continuous 20-minute blocks, or 8–10-minute reps with short recovery, at that controlled pace. One session a week is enough for most runners."],
          ["The common mistake", "Running too fast. Threshold isn't an all-out effort — if you finish destroyed, you went too hard. Done right, it should leave you feeling you could have run one more block."]
        ]
      }
    },
    "dias-descanso": {
      cat: "recuperacao", min: 4, img: "nutrition.png", pos: "center 62%", date: "2026-04-23",
      pt: {
        title: "Dias de descanso: porque parar também é progredir",
        dek: "A adaptação acontece no repouso, não durante o esforço.",
        body: [
          ["", "Há uma ideia teimosa de que mais treino é sempre melhor. Não é. O treino é o estímulo; o progresso acontece quando descansas."],
          ["O que acontece no descanso", "Durante o esforço, crias micro-danos e esgotas reservas. É no repouso — sobretudo no sono — que o corpo repara, reforça e fica mais forte do que antes. Sem descanso, só acumulas fadiga."],
          ["Descanso ativo vs total", "Nem todos os dias de descanso são iguais. Um dia totalmente parado é válido; um trote muito leve, uma caminhada ou mobilidade também 'contam' como recuperação e mantêm o hábito."],
          ["Sinais de que precisas de parar", "Sono perturbado, irritabilidade, frequência cardíaca de repouso elevada e pernas sempre pesadas. Tirar um dia a tempo é treino inteligente, não preguiça."]
        ]
      },
      en: {
        title: "Rest days: why stopping is progress too",
        dek: "Adaptation happens at rest, not during the effort.",
        body: [
          ["", "There's a stubborn idea that more training is always better. It isn't. Training is the stimulus; progress happens when you rest."],
          ["What happens at rest", "During effort you create micro-damage and deplete stores. It's at rest — especially in sleep — that the body repairs, rebuilds and comes back stronger than before. Without rest, you only pile up fatigue."],
          ["Active vs full rest", "Not all rest days are equal. A fully off day is valid; a very easy jog, a walk or mobility also 'count' as recovery and keep the habit alive."],
          ["Signs you need to stop", "Disturbed sleep, irritability, an elevated resting heart rate and constantly heavy legs. Taking a day in time is smart training, not laziness."]
        ]
      }
    },
    "correr-inverno": {
      cat: "equipamento", min: 5, img: "shoes.png", pos: "center 65%", date: "2026-04-15",
      pt: {
        title: "Correr no inverno: como te vestires por camadas",
        dek: "Regra dos +10°C e os tecidos que mantêm o calor sem suar a mais.",
        body: [
          ["", "Não há mau tempo, só más escolhas de roupa. Com o sistema certo de camadas, correr no frio passa de sofrimento a um dos prazeres do inverno."],
          ["A regra dos +10°C", "Veste-te para uma temperatura cerca de 10°C acima da real. Vais sair com algum frio — e é assim que deve ser. Ao fim de cinco minutos, o corpo aquece e ficas confortável em vez de encharcado."],
          ["O sistema de camadas", "Base que afasta o suor (nunca algodão), uma camada intermédia se estiver muito frio, e um corta-vento à prova de água por cima. Protege as extremidades: gorro e luvas valem mais do que um casaco grosso."],
          ["Segurança e visibilidade", "Com menos luz, sê visível: cores claras ou refletores. Em piso molhado ou gelo, encurta a passada e abranda — o relógio pode esperar, uma queda não."]
        ]
      },
      en: {
        title: "Winter running: how to layer up",
        dek: "The +10°C rule and the fabrics that keep you warm without overheating.",
        body: [
          ["", "There's no bad weather, only bad clothing choices. With the right layering system, running in the cold goes from suffering to one of winter's quiet pleasures."],
          ["The +10°C rule", "Dress for a temperature about 10°C warmer than it actually is. You'll head out a little cold — and that's exactly right. After five minutes the body warms up and you're comfortable instead of soaked."],
          ["The layering system", "A base layer that wicks sweat (never cotton), a mid layer if it's very cold, and a waterproof windbreaker on top. Protect the extremities: a hat and gloves do more than a thick jacket."],
          ["Safety and visibility", "With less daylight, be seen: light colours or reflectors. On wet ground or ice, shorten your stride and slow down — the watch can wait, a fall can't."]
        ]
      }
    },
    "criar-habito": {
      cat: "mente", min: 6, img: "hero.png", pos: "center 42%", date: "2026-04-08",
      pt: {
        title: "Cria o hábito: corre mesmo nos dias sem vontade",
        dek: "Pequenos sistemas que tornam o treino automático.",
        body: [
          ["", "A motivação é traiçoeira — aparece e desaparece. Quem corre durante anos não tem mais força de vontade do que tu; tem melhores sistemas."],
          ["Reduz o atrito", "Deixa a roupa preparada na noite anterior. Quanto menos decisões tiveres de tomar de manhã, mais fácil é começar. O passo mais difícil é sempre o de sair pela porta."],
          ["A regra dos dois minutos", "Nos dias sem vontade, compromete-te só com dois minutos. Calça os ténis e corre o quarteirão. Quase sempre continuas — e nos raros dias em que não, fizeste na mesma mais do que zero."],
          ["Liga a corrida a algo fixo", "Ancorar o treino a um momento do dia (antes do duche, depois de levar os miúdos à escola) transforma-o em rotina. Com o tempo, deixas de decidir: simplesmente corres."]
        ]
      },
      en: {
        title: "Build the habit: run even on the days you don't feel like it",
        dek: "Small systems that make training automatic.",
        body: [
          ["", "Motivation is treacherous — it comes and goes. People who run for years don't have more willpower than you; they have better systems."],
          ["Reduce the friction", "Lay your kit out the night before. The fewer decisions you have to make in the morning, the easier it is to start. The hardest step is always getting out the door."],
          ["The two-minute rule", "On the days you don't feel like it, commit to just two minutes. Put your shoes on and run to the corner. You'll almost always carry on — and on the rare days you don't, you still did more than nothing."],
          ["Anchor it to something fixed", "Tying your run to a moment in the day (before your shower, after the school drop-off) turns it into routine. Over time, you stop deciding: you just run."]
        ]
      }
    },
    "repeticoes-subida": {
      cat: "treino", min: 7, img: "track.png", pos: "center 22%", date: "2026-04-01",
      pt: {
        title: "Repetições em subida: força e velocidade no mesmo treino",
        dek: "O exercício mais subvalorizado para ganhares potência.",
        body: [
          ["", "As repetições em subida são ginásio e velocidade ao mesmo tempo — sem pesos e sem grande risco de lesão. Se nunca as fizeste, estás a deixar progresso em cima da mesa."],
          ["Porque resultam", "Correr a subir obriga os músculos a trabalhar contra a gravidade, ganhando força específica. Como o impacto é menor do que num sprint no plano, é uma forma mais segura de treinar potência."],
          ["Uma sessão simples", "Depois de aquecer bem, faz 6 a 10 repetições de 60 a 90 segundos numa subida moderada, forte mas controlado. Recupera a descer a trote. Termina com 10 minutos de calma."],
          ["Onde encaixar", "Uma vez por semana, na fase de construção, chega. Os ganhos de força e de economia de corrida vão sentir-se também no plano — vais correr mais rápido com o mesmo esforço."]
        ]
      },
      en: {
        title: "Hill repeats: strength and speed in one session",
        dek: "The most underrated workout for building power.",
        body: [
          ["", "Hill repeats are the gym and speed work at once — no weights and little injury risk. If you've never done them, you're leaving progress on the table."],
          ["Why they work", "Running uphill forces the muscles to work against gravity, building specific strength. Because the impact is lower than a flat sprint, it's a safer way to train power."],
          ["A simple session", "After a good warm-up, do 6 to 10 reps of 60 to 90 seconds on a moderate hill, hard but controlled. Recover by jogging down. Finish with 10 minutes easy."],
          ["Where it fits", "Once a week during the build phase is enough. The gains in strength and running economy show up on the flat too — you'll run faster at the same effort."]
        ]
      }
    }
  };

  var order = ["regra-10-porcento", "tenis-certo", "zonas-fc", "24-horas-longao", "muro-km30", "treino-limiar", "dias-descanso", "correr-inverno", "criar-habito", "repeticoes-subida"];

  window.NP_ARTICLES = order.map(function (slug) {
    var a = A[slug], L = EN ? a.en : a.pt;
    return { slug: slug, cat: a.cat, catLabel: EN ? CAT[a.cat].en : CAT[a.cat].pt, min: a.min, img: a.img, pos: a.pos, title: L.title, dek: L.dek };
  });

  window.NP_getArticle = function (slug) {
    var a = A[slug];
    if (!a) return null;
    var L = EN ? a.en : a.pt;
    return { slug: slug, cat: a.cat, catLabel: EN ? CAT[a.cat].en : CAT[a.cat].pt, min: a.min, img: a.img, pos: a.pos, date: a.date, title: L.title, dek: L.dek, body: L.body };
  };
})();
