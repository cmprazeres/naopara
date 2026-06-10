/* ===========================================================
   NÃO PARA — gerador de planos de treino (PT / EN)
   Lê window.NP_LANG ('pt' | 'en'). Default 'pt'.
   window.NP_PLANS -> metadados ; window.NP_buildPlan(slug) -> plano completo
   =========================================================== */
(function () {
  "use strict";
  var EN = (window.NP_LANG === "en");

  var WD = EN ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
              : ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  function ramp(s, p, f) { return s + (p - s) * f; }
  function r1(x) { return Math.round(x * 2) / 2; }
  function ri(x) { return Math.round(x); }

  /* tradução de fragmentos reutilizados */
  var LEVEL = { "Iniciante": "Beginner", "Sub-25 min": "Sub-25 min", "Intermédio": "Intermediate", "Avançado": "Advanced", "Meia maratona": "Half marathon", "Sub-1h45": "Sub-1h45", "Maratona": "Marathon", "Sub-3h30": "Sub-3h30", "Montanha": "Mountain" };
  var GOAL = { "Correr 5 km sem parar": "Run 5 km non-stop", "Baixar dos 25 minutos nos 5K": "Break 25 minutes in the 5K", "Completar 10K com confiança": "Finish a 10K with confidence", "Descer abaixo dos 45 minutos": "Go under 45 minutes", "Cruzar a meia maratona inteiro": "Finish the half marathon strong", "Meia maratona abaixo de 1h45": "Half marathon under 1h45", "Terminar a primeira maratona": "Finish your first marathon", "Maratona abaixo de 3h30": "Marathon under 3h30", "Encarar o teu primeiro trail": "Take on your first trail race" };
  var PACE = { "ritmo 5K": "5K pace", "ritmo 10K": "10K pace", "ritmo 10–15K": "10–15K pace", "ritmo meia": "half-marathon pace" };
  var RECOV = { "200m de trote": "200m jog", "400m de trote": "400m jog" };
  function tr(map, s) { return EN ? (map[s] || s) : s; }

  /* etiquetas / construtores de texto por idioma */
  var T = EN ? {
    restTitle: "Rest", restMid: "Full rest or light mobility.", restEnd: "Recover. Light mobility if you feel like it.",
    crossChip: "Strength", crossTitle: "Strength & core", crossDet: "30–40 min · squats, lunges, core and mobility.",
    easyChip: "Easy", easyTitle: function (km) { return km + " km easy"; }, easyDet: "Conversational pace. Finish feeling you could go on.",
    recChip: "Recovery", recTitle: function (km) { return km + " km recovery"; }, recDet: "Very easy and short. Shake out the long run.",
    qChip: "Quality",
    hillsTitle: function (n) { return n + " × hills"; }, hillsDet: function (n) { return "Warm up 15 min. " + n + " × 60–90s hard uphill, jog down. 10 min easy."; },
    repsTitle: function (reps, dist) { return reps + " × " + dist; },
    repsDet: function (reps, dist, pace, rec) { return "Warm up 15 min. " + reps + " × " + dist + " at " + pace + ", " + rec + ". 10 min cool-down."; },
    tempoChip: "Threshold", tempoTitle: function (min) { return "Threshold " + min + " min"; },
    tempoDet: function (min) { return "Warm up 12 min. " + tempoBlock(min) + ". 8 min cool-down."; },
    longChip: "Long", longTitle: function (km) { return km + " km long run"; },
    longNormal: "Easy and steady, no forcing.",
    longMP: function (km) { return "Easy, with the final " + km + " km at marathon pace."; },
    longRace: "Includes 5 km at race pace mid-run.",
    longTrail: "On trail, with elevation. Hike the steep climbs.",
    longTaper: "Shorter and relaxed. Save your legs for race day.",
    raceChip: "Race"
  } : {
    restTitle: "Descanso", restMid: "Descanso total ou mobilidade leve.", restEnd: "Recupera. Mobilidade ligeira se apetecer.",
    crossChip: "Força", crossTitle: "Força & core", crossDet: "30–40 min · agachamentos, lunges, core e mobilidade.",
    easyChip: "Fácil", easyTitle: function (km) { return km + " km fácil"; }, easyDet: "Ritmo de conversa. Termina a sentir que podias continuar.",
    recChip: "Recuper.", recTitle: function (km) { return km + " km regenerativo"; }, recDet: "Muito fácil e curto. Solta as pernas do longão.",
    qChip: "Qualidade",
    hillsTitle: function (n) { return n + " × subidas"; }, hillsDet: function (n) { return "Aquece 15 min. " + n + " × 60–90s em subida forte, desce a trote. 10 min calma."; },
    repsTitle: function (reps, dist) { return reps + " × " + dist; },
    repsDet: function (reps, dist, pace, rec) { return "Aquece 15 min. " + reps + " × " + dist + " a " + pace + ", " + rec + ". 10 min de calma."; },
    tempoChip: "Limiar", tempoTitle: function (min) { return "Limiar " + min + " min"; },
    tempoDet: function (min) { return "Aquece 12 min. " + tempoBlock(min) + ". 8 min de calma."; },
    longChip: "Longo", longTitle: function (km) { return km + " km longão"; },
    longNormal: "Ritmo fácil e constante, sem forçar.",
    longMP: function (km) { return "Fácil, com os últimos " + km + " km a ritmo de maratona."; },
    longRace: "Inclui 5 km a ritmo de prova a meio do percurso.",
    longTrail: "Em trilho, com desnível. Caminha as subidas íngremes.",
    longTaper: "Mais curto e relaxado. Poupa as pernas para o dia D.",
    raceChip: "Prova"
  };

  function tempoBlock(min) {
    if (min <= 20) return EN ? (min + " min continuous at threshold pace") : (min + " min contínuos a ritmo de limiar");
    var half = Math.round(min / 2 / 5) * 5;
    return EN ? ("2 × " + half + " min at threshold (3 min jog between)")
              : ("2 × " + half + " min a ritmo de limiar (3 min trote entre blocos)");
  }

  /* ---- definição dos planos ---- */
  var P = {
    "5k-iniciante": {
      dist: "5K", level: "Iniciante", weeks: 8, freq: 3, diff: 1, goal: "Correr 5 km sem parar", taper: 1, kind: "runwalk",
      blurb: "Do sofá aos 5 quilómetros. Sem pressas, sem dores — combinas caminhada e corrida até correres a distância de seguida.",
      blurb_en: "From the couch to 5 km. No rush, no pain — you mix walking and running until you can run the distance non-stop.",
      paces: "Corre a um ritmo confortável em que consigas manter uma conversa. O objetivo é tempo em pé, nunca a velocidade.",
      paces_en: "Run at a comfortable pace where you can hold a conversation. The goal is time on feet, never speed."
    },
    "5k-sub25": {
      dist: "5K", level: "Sub-25 min", weeks: 6, freq: 4, diff: 3, goal: "Baixar dos 25 minutos nos 5K", taper: 1,
      shape: ["rest", "quality", "easy", "rest", "tempo", "rest", "long"], easy: [4, 6], long: [6, 10],
      q1: { dist: "400m", pace: "ritmo 5K", rec: "200m de trote", reps: [6, 10] }, q2: { min: [15, 25] },
      blurb: "Já corres 5K? Afina o motor e ataca a barreira dos 25 minutos com velocidade e ritmo de limiar.",
      blurb_en: "Already running 5K? Sharpen the engine and attack the 25-minute barrier with speed and threshold work.",
      paces: "Ritmo 5K ≈ esforço duro mas controlado. Limiar ≈ confortavelmente difícil. Fácil ≈ a conversar.",
      paces_en: "5K pace ≈ hard but controlled. Threshold ≈ comfortably hard. Easy ≈ conversational."
    },
    "10k-intermedio": {
      dist: "10K", level: "Intermédio", weeks: 10, freq: 4, diff: 2, goal: "Completar 10K com confiança", taper: 1,
      shape: ["rest", "quality", "easy", "rest", "tempo", "rest", "long"], easy: [5, 8], long: [8, 16],
      q1: { dist: "800m", pace: "ritmo 10K", rec: "200m de trote", reps: [5, 8] }, q2: { min: [20, 30] },
      blurb: "Resistência e ritmo combinados para um 10K forte. O degrau perfeito antes de saltares para a meia maratona.",
      blurb_en: "Endurance and pace combined for a strong 10K. The perfect step before moving up to the half marathon.",
      paces: "Ritmo 10K ≈ duro mas sustentável. Limiar ≈ confortavelmente difícil. Longão ≈ fácil e descontraído.",
      paces_en: "10K pace ≈ hard but sustainable. Threshold ≈ comfortably hard. Long run ≈ easy and relaxed."
    },
    "10k-avancado": {
      dist: "10K", level: "Avançado", weeks: 8, freq: 5, diff: 4, goal: "Descer abaixo dos 45 minutos", taper: 1,
      shape: ["rest", "quality", "easy", "cross", "tempo", "rest", "long"], easy: [6, 10], long: [10, 18],
      q1: { dist: "1000m", pace: "ritmo 10K", rec: "200m de trote", reps: [6, 10] }, q2: { min: [20, 35] },
      blurb: "Para quem quer voar nos 10K. Volume controlado e intensidade cirúrgica para baixares dos 45 minutos.",
      blurb_en: "For runners who want to fly over 10K. Controlled volume and surgical intensity to break 45 minutes.",
      paces: "Ritmo 10K ≈ controlado-duro. VO₂máx nos intervalos. Limiar nos contínuos. Longão sempre fácil.",
      paces_en: "10K pace ≈ controlled-hard. VO₂max on the intervals. Threshold on the tempos. Long run always easy."
    },
    "21k-popular": {
      dist: "21K", level: "Meia maratona", weeks: 12, freq: 4, diff: 3, goal: "Cruzar a meia maratona inteiro", taper: 2, popular: true,
      shape: ["rest", "quality", "easy", "rest", "tempo", "rest", "long"], easy: [6, 10], long: [10, 19],
      q1: { dist: "1600m", pace: "ritmo 10–15K", rec: "400m de trote", reps: [4, 6] }, q2: { min: [20, 40] },
      blurb: "A distância rainha do equilíbrio. Longões progressivos, treino de limiar e simulação de prova até aos 21,1 km.",
      blurb_en: "The queen of balance. Progressive long runs, threshold work and race simulation up to 21.1 km.",
      paces: "Longão a ritmo fácil-conversa. Limiar ≈ confortavelmente difícil. Ritmo de prova nas semanas finais.",
      paces_en: "Long run at easy conversational pace. Threshold ≈ comfortably hard. Race pace in the final weeks."
    },
    "21k-sub145": {
      dist: "21K", level: "Sub-1h45", weeks: 14, freq: 5, diff: 4, goal: "Meia maratona abaixo de 1h45", taper: 2,
      shape: ["rest", "quality", "easy", "tempo", "rest", "long", "rec"], easy: [7, 11], long: [12, 21], rec: [5, 7],
      q1: { dist: "1000m", pace: "ritmo 10K", rec: "200m de trote", reps: [5, 8] }, q2: { min: [25, 45] },
      blurb: "Plano de performance para meias maratonistas que querem voar nos 21 quilómetros e bater 1h45.",
      blurb_en: "A performance plan for half-marathoners who want to fly over 21 km and break 1h45.",
      paces: "Ritmo-alvo ≈ 4:58/km. Intervalos a ritmo 10K, limiar mais longo, longões com blocos a ritmo de prova.",
      paces_en: "Target pace ≈ 4:58/km. Intervals at 10K pace, longer threshold, long runs with race-pace blocks."
    },
    "42k-iniciante": {
      dist: "42K", level: "Maratona", weeks: 16, freq: 5, diff: 4, goal: "Terminar a primeira maratona", taper: 2, mp: true,
      shape: ["rest", "quality", "easy", "cross", "tempo", "rest", "long"], easy: [6, 11], long: [14, 32],
      q1: { dist: "1600m", pace: "ritmo meia", rec: "400m de trote", reps: [4, 6] }, q2: { min: [25, 40] },
      blurb: "Periodização completa para a tua primeira maratona. Constróis a resistência passo a passo e chegas à meta inteiro.",
      blurb_en: "Full periodization for your first marathon. You build endurance step by step and reach the finish strong.",
      paces: "A maioria dos km corre-se fácil. Ritmo de maratona (RM) aparece nos longões finais. Nada de heróis.",
      paces_en: "Most km are run easy. Marathon pace (MP) shows up in the final long runs. No heroics."
    },
    "42k-sub330": {
      dist: "42K", level: "Sub-3h30", weeks: 18, freq: 6, diff: 5, goal: "Maratona abaixo de 3h30", taper: 3, mp: true,
      shape: ["rec", "quality", "easy", "tempo", "easy", "rest", "long"], easy: [8, 12], long: [16, 34], rec: [6, 8],
      q1: { dist: "1600m", pace: "ritmo meia", rec: "400m de trote", reps: [5, 8] }, q2: { min: [30, 50] },
      blurb: "Para maratonistas experientes em busca da marca. Volume alto, gestão de fadiga e longões com ritmo de maratona.",
      blurb_en: "For experienced marathoners chasing a time. High volume, fatigue management and long runs at marathon pace.",
      paces: "Ritmo-alvo ≈ 4:58/km. Duplos treinos em dias-chave, longões com grandes blocos a RM.",
      paces_en: "Target pace ≈ 4:58/km. Double runs on key days, long runs with big MP blocks."
    },
    "trail": {
      dist: "Trail", level: "Montanha", weeks: 12, freq: 4, diff: 3, goal: "Encarar o teu primeiro trail", taper: 2, trail: true,
      shape: ["rest", "quality", "easy", "rest", "cross", "rest", "long"], easy: [5, 9], long: [10, 22],
      q1: { type: "hills", reps: [6, 12] },
      blurb: "Sai do asfalto. Força específica, técnica de descida e resistência para encarares os trilhos com desnível.",
      blurb_en: "Leave the asphalt. Specific strength, downhill technique and endurance to take on the trails and their climbs.",
      paces: "No trail o esforço manda, não o ritmo. Caminha as subidas íngremes sem culpa — faz parte da estratégia.",
      paces_en: "On trail, effort rules, not pace. Hike the steep climbs without guilt — it's part of the strategy."
    }
  };

  function buildStandard(plan) {
    var W = plan.weeks, taper = plan.taper || 1, buildW = W - taper;
    var weeks = [], peakKm = 0;
    for (var i = 0; i < W; i++) {
      var isTaper = i >= buildW, taperPos = i - buildW;
      var f = isTaper ? 1 : (buildW > 1 ? i / (buildW - 1) : 1);
      var deload = !isTaper && ((i + 1) % 4 === 0);
      var vmul = deload ? 0.82 : 1, longMul = 1;
      if (isTaper) longMul = Math.max(0.32, 0.62 - 0.16 * taperPos);
      var easyKm = r1(ramp(plan.easy[0], plan.easy[1], f) * (isTaper ? 0.85 : vmul));
      var longKm = r1(ramp(plan.long[0], plan.long[1], f) * (isTaper ? longMul : vmul));
      var recKm = plan.rec ? r1(ramp(plan.rec[0], plan.rec[1], f)) : 0;
      var weekKm = 0;
      var days = plan.shape.map(function (tok, di) {
        var d = { wd: WD[di], token: tok };
        switch (tok) {
          case "rest":
            d.cls = "t-rest"; d.chip = T.restTitle; d.title = T.restTitle;
            d.det = di === 6 ? T.restEnd : T.restMid; break;
          case "cross":
            d.cls = "t-force"; d.chip = T.crossChip; d.title = T.crossTitle; d.det = T.crossDet; break;
          case "easy":
            d.cls = "t-easy"; d.chip = T.easyChip; d.title = T.easyTitle(easyKm); d.det = T.easyDet; weekKm += easyKm; break;
          case "rec":
            d.cls = "t-rec"; d.chip = T.recChip; d.title = T.recTitle(recKm); d.det = T.recDet; weekKm += recKm; break;
          case "quality":
            d.cls = "t-q"; d.chip = T.qChip;
            if (plan.q1.type === "hills") {
              var hr = ri(ramp(plan.q1.reps[0], plan.q1.reps[1], f) * (isTaper ? 0.6 : vmul));
              d.title = T.hillsTitle(hr); d.det = T.hillsDet(hr); weekKm += 7;
            } else {
              var reps = Math.max(3, ri(ramp(plan.q1.reps[0], plan.q1.reps[1], f) * (isTaper ? 0.6 : vmul)));
              d.title = T.repsTitle(reps, plan.q1.dist);
              d.det = T.repsDet(reps, plan.q1.dist, tr(PACE, plan.q1.pace), tr(RECOV, plan.q1.rec)); weekKm += 8;
            }
            break;
          case "tempo":
            d.cls = "t-tempo"; d.chip = T.tempoChip;
            var tm = ri(ramp(plan.q2.min[0], plan.q2.min[1], f) * (isTaper ? 0.7 : vmul));
            d.title = T.tempoTitle(tm); d.det = T.tempoDet(tm); weekKm += Math.round(tm / 5) + 4; break;
          case "long":
            d.cls = "t-long"; d.chip = isTaper && false ? T.raceChip : T.longChip; d.title = T.longTitle(longKm);
            var det = T.longNormal;
            if (plan.mp && f > 0.5 && !isTaper) { var mpk = r1(Math.min(longKm * 0.4, ramp(6, 16, f))); det = T.longMP(mpk); }
            else if (plan.popular && f > 0.6 && !isTaper) det = T.longRace;
            else if (plan.trail) det = T.longTrail;
            else if (isTaper) det = T.longTaper;
            d.det = det; weekKm += longKm; break;
          default: d.cls = "t-rest"; d.chip = "—"; d.title = "—"; d.det = "";
        }
        return d;
      });
      weekKm = Math.round(weekKm);
      if (!isTaper && weekKm > peakKm) peakKm = weekKm;
      var wk = { n: i + 1, km: weekKm, deload: deload, taper: isTaper, taperPos: taperPos, phase: phaseOf(f, isTaper), focus: focusOf(f, isTaper, deload) };
      wk.days = days; weeks.push(wk);
    }
    return { weeks: weeks, peakKm: peakKm };
  }

  function phaseOf(f, isTaper) { if (isTaper) return "taper"; if (f < 0.34) return "base"; if (f < 0.7) return "build"; return "peak"; }
  var PHASE = EN ? {
    base: { n: "Phase 01", t: "Aerobic base", d: "Build the habit and base endurance. Run easy and rack up the kilometres, no rush." },
    build: { n: "Phase 02", t: "Build", d: "Raise the volume and add intensity. This is where most of your fitness is made." },
    peak: { n: "Phase 03", t: "Specific", d: "Race-specific training: target pace, tougher long runs and race simulation." },
    taper: { n: "Phase 04", t: "Taper & race", d: "Cut the volume, keep the freshness. You reach race day rested and sharp." }
  } : {
    base: { n: "Fase 01", t: "Base aeróbica", d: "Construir o hábito e a resistência de base. Corre suave e acumula quilómetros sem pressa." },
    build: { n: "Fase 02", t: "Construção", d: "Sobe o volume e introduz intensidade. É aqui que ganhas a maior parte da forma." },
    peak: { n: "Fase 03", t: "Específico", d: "Treino à medida da prova: ritmo-alvo, longões mais exigentes e simulação de prova." },
    taper: { n: "Fase 04", t: "Afinamento & prova", d: "Reduz o volume, mantém a frescura. Chegas ao dia D descansado e afiado." }
  };
  function focusOf(f, isTaper, deload) {
    if (EN) { if (isTaper) return "Taper"; if (deload) return "Down week"; if (f < 0.34) return "Adaptation"; if (f < 0.7) return "Volume + pace"; return "Race pace"; }
    if (isTaper) return "Afinamento"; if (deload) return "Semana de descarga"; if (f < 0.34) return "Adaptação"; if (f < 0.7) return "Volume + ritmo"; return "Ritmo de prova";
  }

  /* ---- plano iniciante 5K (corre/anda) ---- */
  function buildRunWalk() {
    var prog = EN ? [
      { longTxt: "8 × (1 min run + 2 min walk)", shortTxt: "6 × (1 min run + 2 min walk)" },
      { longTxt: "7 × (1.5 min run + 1.5 min walk)", shortTxt: "6 × (1.5 min run + 1.5 min walk)" },
      { longTxt: "6 × (2 min run + 1.5 min walk)", shortTxt: "5 × (2 min run + 1.5 min walk)" },
      { longTxt: "5 × (3 min run + 1.5 min walk)", shortTxt: "5 × (2.5 min run + 1.5 min walk)" },
      { longTxt: "4 × (5 min run + 1.5 min walk)", shortTxt: "5 × (4 min run + 1.5 min walk)" },
      { longTxt: "3 × (8 min run + 2 min walk)", shortTxt: "4 × (6 min run + 1.5 min walk)" },
      { longTxt: "2 × (12 min run + 2 min walk)", shortTxt: "3 × (10 min run + 1.5 min walk)" },
      { longTxt: "30 min continuous run — your 5K!", shortTxt: "20 min continuous run" }
    ] : [
      { longTxt: "8 × (1 min corrida + 2 min caminhada)", shortTxt: "6 × (1 min corrida + 2 min caminhada)" },
      { longTxt: "7 × (1,5 min corrida + 1,5 min caminhada)", shortTxt: "6 × (1,5 min corrida + 1,5 min caminhada)" },
      { longTxt: "6 × (2 min corrida + 1,5 min caminhada)", shortTxt: "5 × (2 min corrida + 1,5 min caminhada)" },
      { longTxt: "5 × (3 min corrida + 1,5 min caminhada)", shortTxt: "5 × (2,5 min corrida + 1,5 min caminhada)" },
      { longTxt: "4 × (5 min corrida + 1,5 min caminhada)", shortTxt: "5 × (4 min corrida + 1,5 min caminhada)" },
      { longTxt: "3 × (8 min corrida + 2 min caminhada)", shortTxt: "4 × (6 min corrida + 1,5 min caminhada)" },
      { longTxt: "2 × (12 min corrida + 2 min caminhada)", shortTxt: "3 × (10 min corrida + 1,5 min caminhada)" },
      { longTxt: "30 min de corrida contínua — os teus 5K!", shortTxt: "20 min de corrida contínua" }
    ];
    var focus = EN ? ["First steps", "Find a rhythm", "More running", "3-min blocks", "5-min blocks", "Almost continuous", "Home straight", "Race: 5 km"]
                   : ["Primeiros passos", "Ganhar ritmo", "Mais corrida", "Blocos de 3 min", "Blocos de 5 min", "Quase contínuo", "Reta final", "Prova: 5 km"];
    var L = EN ? { rest: "Rest", restDet1: "Recover for tomorrow's session.", walkChip: "Run/Walk", a: "Session A", aDet1: "Warm up 5 min walking. ", aDet2: ". 5 min walking.", restWalk: "Rest or walk", restWalkDet: "20–30 min easy walk, optional.", b: "Session B", restForce: "Rest", restForceDet: "Light strength and stretching, if you like.", c: "Session C", race: "Race", raceTitle: "5 KM 🏁", cDet2: ". Relax at the end.", restEnd: "Rest", restEndDet: "Full rest. You earned it." }
               : { rest: "Descanso", restDet1: "Recupera para o treino de amanhã.", walkChip: "Corre/Anda", a: "Sessão A", aDet1: "Aquece 5 min a andar. ", aDet2: ". 5 min a andar.", restWalk: "Descanso ou caminhada", restWalkDet: "20–30 min de caminhada leve, opcional.", b: "Sessão B", restForce: "Descanso", restForceDet: "Força leve e alongamentos, se quiseres.", c: "Sessão C", race: "Prova", raceTitle: "5 KM 🏁", cDet2: ". Relaxa no fim.", restEnd: "Descanso", restEndDet: "Descanso total. Mereceste." };
    return {
      peakKm: null,
      weeks: prog.map(function (p, i) {
        var isTaper = i === 7;
        var days = [
          { wd: WD[0], token: "rest", cls: "t-rest", chip: L.rest, title: L.rest, det: L.restDet1 },
          { wd: WD[1], token: "quality", cls: "t-q", chip: L.walkChip, title: L.a, det: L.aDet1 + p.longTxt + L.aDet2 },
          { wd: WD[2], token: "rest", cls: "t-rest", chip: L.rest, title: L.restWalk, det: L.restWalkDet },
          { wd: WD[3], token: "easy", cls: "t-easy", chip: L.walkChip, title: L.b, det: L.aDet1 + p.shortTxt + L.aDet2 },
          { wd: WD[4], token: "rest", cls: "t-rest", chip: L.rest, title: L.restForce, det: L.restForceDet },
          { wd: WD[5], token: "long", cls: "t-long", chip: isTaper ? L.race : (EN ? "Long" : "Longo"), title: isTaper ? L.raceTitle : L.c, det: L.aDet1 + p.longTxt + L.cDet2 },
          { wd: WD[6], token: "rest", cls: "t-rest", chip: L.restEnd, title: L.restEnd, det: L.restEndDet }
        ];
        var w = { n: i + 1, km: null, deload: false, taper: isTaper, taperPos: 0, phase: i < 3 ? "base" : (i < 6 ? "build" : (i < 7 ? "peak" : "taper")), focus: focus[i] };
        w.days = days; return w;
      })
    };
  }

  var META = {};
  Object.keys(P).forEach(function (k) {
    var p = P[k];
    META[k] = { slug: k, dist: p.dist, level: EN ? LEVEL[p.level] : p.level, weeks: p.weeks, freq: p.freq, diff: p.diff, goal: EN ? GOAL[p.goal] : p.goal, blurb: EN ? p.blurb_en : p.blurb, popular: !!p.popular };
  });

  window.NP_PLANS = META;
  window.NP_PHASE = PHASE;
  window.NP_buildPlan = function (slug) {
    var p = P[slug];
    if (!p) return null;
    var built = p.kind === "runwalk" ? buildRunWalk() : buildStandard(p);
    return {
      slug: slug, dist: p.dist, level: EN ? LEVEL[p.level] : p.level, weeks: p.weeks, freq: p.freq,
      diff: p.diff, goal: EN ? GOAL[p.goal] : p.goal, blurb: EN ? p.blurb_en : p.blurb,
      paces: EN ? p.paces_en : p.paces, popular: !!p.popular, peakKm: built.peakKm, data: built.weeks
    };
  };
})();
