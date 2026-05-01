#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Completa o arquivo falas_jesus.txt com TODAS as falas de Jesus na Bíblia
e regenera o falas-jesus.html com os dados completos.
"""
import re, os

BASE = os.path.dirname(os.path.abspath(__file__))
TXT_PATH = os.path.join(BASE, 'falas_jesus.txt')
HTML_PATH = os.path.join(BASE, 'falas-jesus.html')

# ── 1. Ler o TXT existente e localizar o ponto de truncamento ───────────
with open(TXT_PATH, 'r', encoding='utf-8') as f:
    txt = f.read()

# Encontrar a última linha truncada e cortá-la
trunc_marker = '{ ref: "Jo 12:23-32", text: "É chegada a hora em que o Filho do Homem deve ser glorificado. Em verdade, em verdade v'
idx = txt.find(trunc_marker)
if idx == -1:
    # Talvez já tenha sido corrigido; verificar se Jo 21 já existe
    if 'Jo 21:' in txt:
        print("TXT já parece completo. Pulando correção do TXT.")
        txt_ok = txt
    else:
        raise RuntimeError("Marcador de truncamento não encontrado e João não está completo!")
else:
    # Cortar tudo a partir do marcador truncado
    txt_ok = txt[:idx]
    
    # Adicionar a entrada completa de Jo 12:23-32 + restante de João + ATOS + APOCALIPSE
    remaining = '''      { ref: "Jo 12:23-32", text: "É chegada a hora em que o Filho do Homem deve ser glorificado. Em verdade, em verdade vos digo que, se o grão de trigo, caindo na terra, não morrer, fica ele só; mas, se morrer, produz muito fruto. Quem ama a sua vida a perderá; e quem neste mundo a odiar, a guardará para a vida eterna. Se alguém me serve, siga-me; e onde eu estiver, ali estará também o meu servo. Se alguém me servir, meu Pai o honrará. Agora a minha alma está turbada; e o que direi? Pai, salva-me desta hora? Mas para isso vim a esta hora. Pai, glorifica o teu nome. E eu, quando for levantado da terra, todos atrairei a mim." },
      { ref: "Jo 12:35-36", text: "A luz ainda está convosco por um pouco de tempo. Andai enquanto tendes a luz, para que as trevas não vos apanhem; pois quem anda nas trevas não sabe para onde vai. Enquanto tendes a luz, crede na luz, para que sejais filhos da luz." },
      { ref: "Jo 12:44-50", text: "Quem crê em mim, crê não em mim, mas naquele que me enviou. E quem me vê a mim vê aquele que me enviou. Eu vim como luz ao mundo, para que todo o que crê em mim não permaneça nas trevas. E, se alguém ouvir as minhas palavras e não as guardar, eu não o julgo; porque não vim para julgar o mundo, mas para salvar o mundo. Quem me rejeita e não recebe as minhas palavras já tem quem o julgue; a palavra que tenho falado, essa o julgará no último dia. Porque eu não falei por mim mesmo; mas o Pai que me enviou, ele mesmo me deu mandamento sobre o que hei de dizer e sobre o que hei de falar. E sei que o seu mandamento é vida eterna. Portanto, as coisas que eu digo, como o Pai mo disse, assim as digo." },
      { ref: "Jo 13:7", text: "O que eu faço, tu não sabes agora, mas depois entenderás." },
      { ref: "Jo 13:8", text: "Se eu te não lavar, não tens parte comigo." },
      { ref: "Jo 13:10-11", text: "O que está lavado não necessita de lavar senão os pés; pois está todo limpo. Ora, vós estais limpos, mas não todos." },
      { ref: "Jo 13:12-17", text: "Compreendeis o que vos tenho feito? Vós me chamais Mestre e Senhor, e dizeis bem, porque eu o sou. Ora, se eu, sendo Senhor e Mestre, vos lavei os pés, também vós deveis lavar os pés uns dos outros. Porque eu vos dei o exemplo, para que façais o mesmo que eu vos fiz. Em verdade, em verdade vos digo que o servo não é maior do que o seu senhor, nem o enviado maior do que aquele que o enviou. Se sabeis estas coisas, bem-aventurados sois se as fizerdes." },
      { ref: "Jo 13:18", text: "Não falo de todos vós; eu conheço os que escolhi; mas é para que se cumpra a Escritura: O que come o pão comigo, levantou contra mim o seu calcanhar." },
      { ref: "Jo 13:20", text: "Em verdade, em verdade vos digo que quem recebe o que eu enviar me recebe a mim; e quem me recebe a mim recebe aquele que me enviou." },
      { ref: "Jo 13:21", text: "Em verdade, em verdade vos digo que um de vós me há de trair." },
      { ref: "Jo 13:26-27", text: "É aquele a quem eu der o bocado molhado. O que fazes, faze-o depressa." },
      { ref: "Jo 13:31-35", text: "Agora é glorificado o Filho do Homem, e Deus é glorificado nele. Se Deus é glorificado nele, também Deus o glorificará em si mesmo, e logo o há de glorificar. Filhinhos, ainda por um pouco estou convosco. Vós me buscareis; e como eu disse aos judeus — para onde eu vou, vós não podeis vir —, agora digo também a vós. Um novo mandamento vos dou: que vos ameis uns aos outros; como eu vos amei a vós, que também vós uns aos outros vos ameis. Nisto conhecerão todos que sois meus discípulos, se tiverdes amor uns aos outros." },
      { ref: "Jo 13:36-38", text: "Para onde eu vou, agora tu não podes seguir-me; mas depois me seguirás. Tu darás a tua vida por mim? Em verdade, em verdade te digo que não cantará o galo antes que me negues três vezes." },
      { ref: "Jo 14:1-4", text: "Não se turbe o vosso coração; credes em Deus, crede também em mim. Na casa de meu Pai há muitas moradas; se não fosse assim, eu vo-lo teria dito; vou preparar-vos lugar. E, se eu for e vos preparar lugar, virei outra vez e vos levarei para mim mesmo, para que onde eu estiver estejais vós também. E para onde eu vou, e o caminho, vós o conheceis." },
      { ref: "Jo 14:6-7", text: "Eu sou o caminho, e a verdade, e a vida; ninguém vem ao Pai senão por mim. Se me conhecêsseis a mim, também conheceríeis o meu Pai; e já desde agora o conheceis, e o tendes visto." },
      { ref: "Jo 14:9-14", text: "Estou convosco há tanto tempo, e não me conheces, Filipe? Quem me vê a mim vê o Pai; como dizes tu: Mostra-nos o Pai? Não crês tu que eu estou no Pai, e o Pai está em mim? As palavras que eu vos digo não as digo por mim mesmo; mas o Pai, que permanece em mim, ele faz as suas obras. Crede-me que eu estou no Pai, e o Pai está em mim; crede-me, ao menos, pelas mesmas obras. Em verdade, em verdade vos digo que quem crê em mim também fará as obras que eu faço, e fará outras maiores do que estas; porque eu vou para o Pai. E tudo quanto pedirdes em meu nome eu farei, para que o Pai seja glorificado no Filho. Se me pedirdes alguma coisa em meu nome, eu a farei." },
      { ref: "Jo 14:15-21", text: "Se me amais, guardareis os meus mandamentos. E eu rogarei ao Pai, e ele vos dará outro Consolador, para que fique convosco para sempre; o Espírito da verdade, que o mundo não pode receber, porque não o vê nem o conhece; mas vós o conheceis, porque habita convosco e estará em vós. Não vos deixarei órfãos; voltarei para vós. Ainda um pouco, e o mundo não me verá mais; mas vós me vereis, porque eu vivo, e vós vivereis. Naquele dia conhecereis que eu estou no meu Pai, e vós em mim, e eu em vós. Quem tem os meus mandamentos e os guarda, esse é o que me ama; e aquele que me ama será amado de meu Pai, e eu o amarei, e me manifestarei a ele." },
      { ref: "Jo 14:23-24", text: "Se alguém me ama, guardará a minha palavra; e meu Pai o amará, e viremos para ele e faremos nele morada. Quem não me ama não guarda as minhas palavras; e a palavra que ouvis não é minha, mas do Pai que me enviou." },
      { ref: "Jo 14:25-27", text: "Tenho-vos dito estas coisas, estando convosco. Mas o Consolador, o Espírito Santo, que o Pai enviará em meu nome, esse vos ensinará todas as coisas, e vos fará lembrar de tudo quanto vos tenho dito. Deixo-vos a paz, a minha paz vos dou; eu não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize." },
      { ref: "Jo 14:28-31", text: "Ouvistes que eu vos disse: Vou, e venho para vós. Se me amásseis, ficaríeis muito contentes de eu ir para o Pai; pois o Pai é maior do que eu. E agora vo-lo disse antes que aconteça, para que, quando acontecer, creiais. Já não falarei muito convosco; porque vem o príncipe deste mundo; e ele nada tem em mim. Mas para que o mundo saiba que eu amo o Pai, e conforme o Pai me mandou, assim faço. Levantai-vos, vamo-nos daqui." },
      { ref: "Jo 15:1-17", text: "Eu sou a videira verdadeira, e meu Pai é o agricultor. Toda a vara em mim que não dá fruto, a tira; e limpa toda a que dá fruto, para que dê mais fruto. Vós já estais limpos pela palavra que vos tenho falado. Estai em mim, e eu em vós; como a vara de si mesma não pode dar fruto, se não estiver na videira, assim também vós, se não estiverdes em mim. Eu sou a videira, vós sois as varas. Quem está em mim, e eu nele, esse dá muito fruto; porque sem mim nada podeis fazer. Se alguém não estiver em mim, ele é lançado fora, como a vara, e seca; e os ajuntam e lançam no fogo, e ardem. Se vós estiverdes em mim, e as minhas palavras estiverem em vós, pedireis tudo o que quiserdes, e vos será feito. Nisto é glorificado meu Pai, que deis muito fruto; e assim vos tornareis meus discípulos. Como o Pai me amou, também eu vos amei a vós; permanecei no meu amor. Se guardardes os meus mandamentos, permanecereis no meu amor; do mesmo modo que eu guardei os mandamentos de meu Pai, e permaneço no seu amor. Estas coisas vos disse para que a minha alegria permaneça em vós, e a vossa alegria seja completa. O meu mandamento é este: que vos ameis uns aos outros, assim como eu vos amei. Ninguém tem maior amor do que este: dar a sua vida pelos seus amigos. Vós sereis meus amigos, se fizerdes o que eu vos mando. Não mais vos chamo servos, porque o servo não sabe o que faz o seu senhor; mas tenho-vos chamado amigos, porque tudo quanto ouvi de meu Pai vos tenho feito conhecer. Vós não me escolhestes a mim, mas eu vos escolhi a vós, e vos nomeei, para que vades e deis fruto, e o vosso fruto permaneça; para que tudo quanto em meu nome pedirdes ao Pai ele vo-lo conceda. Isto vos mando: que vos ameis uns aos outros." },
      { ref: "Jo 15:18-27", text: "Se o mundo vos odeia, sabei que, primeiro do que a vós, me odiou a mim. Se vós fôsseis do mundo, o mundo amaria o que era seu; mas, porque não sois do mundo, antes eu vos escolhi do mundo, por isso o mundo vos odeia. Lembrai-vos da palavra que vos disse: Não é o servo maior do que o seu senhor. Se me perseguiram a mim, também perseguirão a vós; se guardaram a minha palavra, também guardarão a vossa. Mas tudo isso vos farão por causa do meu nome, porque não conhecem aquele que me enviou. Se eu não tivesse vindo e não lhes tivesse falado, não teriam pecado; agora, porém, não têm desculpa do seu pecado. Aquele que me odeia, odeia também a meu Pai. Se eu não tivesse feito entre eles obras que nenhum outro fez, não teriam pecado; mas agora viram e odiaram tanto a mim como a meu Pai. Mas foi para que se cumprisse a palavra que está escrita na sua lei: Odiaram-me sem causa. Quando vier o Consolador, que eu da parte do Pai vos mandarei, o Espírito da verdade, que procede do Pai, ele testificará de mim. E vós também testificareis, pois estivestes comigo desde o princípio." },
      { ref: "Jo 16:1-4", text: "Estas coisas vos disse para que não vos escandalizeis. Expulsar-vos-ão das sinagogas; vem mesmo a hora em que qualquer que vos matar cuidará fazer um serviço a Deus. E estas coisas vos farão porque não conheceram ao Pai nem a mim. Mas estas coisas vos disse, para que, quando chegar aquela hora, vos lembreis de que eu vo-las disse." },
      { ref: "Jo 16:5-11", text: "Agora vou para aquele que me enviou; e nenhum de vós me pergunta: Para onde vais? Mas porque vos disse estas coisas, a tristeza encheu o vosso coração. Todavia digo-vos a verdade: Convém-vos que eu vá; porque, se eu não for, o Consolador não virá a vós; mas, se eu for, enviar-vo-lo-ei. E quando ele vier, convencerá o mundo do pecado, da justiça e do juízo: do pecado, porque não crêem em mim; da justiça, porque vou para o Pai, e não me vereis mais; e do juízo, porque o príncipe deste mundo está julgado." },
      { ref: "Jo 16:12-15", text: "Ainda tenho muitas coisas para vos dizer, mas vós não as podeis suportar agora. Quando vier aquele Espírito de verdade, ele vos guiará em toda a verdade; porque não falará de si mesmo, mas dirá tudo o que tiver ouvido, e vos anunciará o que há de vir. Ele me glorificará, porque há de receber do que é meu, e vo-lo há de anunciar. Tudo o que o Pai tem é meu; por isso vos disse que há de receber do que é meu e vo-lo há de anunciar." },
      { ref: "Jo 16:16", text: "Um pouco, e não me vereis; e outra vez um pouco, e ver-me-eis." },
      { ref: "Jo 16:20-22", text: "Em verdade, em verdade vos digo que chorareis e vos lamentareis, e o mundo se alegrará, e vós vos entristecereis, mas a vossa tristeza se converterá em alegria. A mulher, quando está em trabalho de parto, tem dor, porque é chegada a sua hora; mas quando nasce a criança, já não se lembra da aflição, pela alegria de haver nascido um homem no mundo. Portanto, vós agora na verdade tendes tristeza; mas outra vez vos verei, e o vosso coração se alegrará, e da vossa alegria ninguém vos tirará." },
      { ref: "Jo 16:23-28", text: "Em verdade, em verdade vos digo que tudo quanto pedirdes ao Pai em meu nome, ele vo-lo concederá. Até agora nada pedistes em meu nome; pedi, e recebereis, para que a vossa alegria se cumpra. Tenho-vos dito essas coisas por figuras; vem a hora em que vos não falarei mais por figuras, mas abertamente vos falarei do Pai. Naquele dia pedireis em meu nome, e não vos digo que eu rogarei ao Pai por vós; pois o próprio Pai vos ama, porque me amastes e crestes que eu saí de Deus. Saí do Pai, e vim ao mundo; outra vez deixo o mundo, e vou para o Pai." },
      { ref: "Jo 16:32-33", text: "Eis que vem a hora, e já é chegada, em que sereis dispersos, cada um para o seu lugar, e me deixareis só; mas não estou só, porque o Pai está comigo. Estas coisas vos disse para que em mim tenhais paz; no mundo tereis aflições; mas tende bom ânimo, eu venci o mundo." },
      { ref: "Jo 17:1-26", text: "Pai, é chegada a hora; glorifica o teu Filho, para que também o teu Filho te glorifique a ti. Assim como lhe deste autoridade sobre toda a carne, para que a todos quantos lhe deste ele dê a vida eterna. E a vida eterna é esta: que te conheçam a ti só, por único Deus verdadeiro, e a Jesus Cristo, a quem enviaste. Eu te glorifiquei na terra, completando a obra que me deste para fazer. E agora glorifica-me tu, ó Pai, junto de ti mesmo, com aquela glória que tinha contigo antes que o mundo existisse. Manifestei o teu nome aos homens que do mundo me deste; eram teus, e tu mos deste, e guardaram a tua palavra. Agora sabem que tudo quanto me deste provém de ti. Porque eu lhes dei as palavras que tu me deste; e eles as receberam, e verdadeiramente conheceram que saí de ti, e creram que me enviaste. Eu rogo por eles; não rogo pelo mundo, mas por aqueles que me deste, porque são teus. E todas as minhas coisas são tuas, e as tuas minhas; e neles sou glorificado. Eu já não estou no mundo, mas eles estão no mundo, e eu vou para ti. Pai santo, guarda-os em teu nome, aqueles que me deste, para que sejam um, assim como nós. Enquanto eu estava com eles no mundo, eu os guardava em teu nome; protegi aqueles que me deste, e nenhum deles se perdeu, senão o filho da perdição, para que a Escritura se cumprisse. Mas agora vou para ti, e digo estas coisas no mundo, para que tenham a minha alegria completa em si mesmos. Dei-lhes a tua palavra, e o mundo os odiou, porque não são do mundo, assim como eu não sou do mundo. Não peço que os tires do mundo, mas que os livres do mal. Não são do mundo, assim como eu não sou do mundo. Santifica-os na verdade; a tua palavra é a verdade. Assim como tu me enviaste ao mundo, também eu os enviei ao mundo. E por eles me santifico, para que também eles sejam santificados na verdade. E não rogo somente por estes, mas também por aqueles que pela sua palavra hão de crer em mim; para que todos sejam um; assim como tu, ó Pai, o és em mim, e eu em ti; que também eles sejam um em nós; para que o mundo creia que tu me enviaste. E eu dei-lhes a glória que a mim me deste, para que sejam um, como nós somos um. Eu neles, e tu em mim, para que eles sejam perfeitos em unidade; para que o mundo conheça que tu me enviaste, e que os amaste como me amaste a mim. Pai, aqueles que me deste quero que, onde eu estiver, também eles estejam comigo, para que contemplem a minha glória que me deste; porque tu me amaste antes da fundação do mundo. Pai justo, o mundo não te conheceu; mas eu te conheci, e estes conheceram que tu me enviaste. Eu lhes declarei o teu nome, e lho declararei, para que o amor com que me amaste esteja neles, e eu neles." },
      { ref: "Jo 18:4-8", text: "A quem buscais? Eu sou. Disse-vos que eu sou; se, pois, me buscais a mim, deixai ir estes." },
      { ref: "Jo 18:11", text: "Mete a tua espada na bainha; não beberei eu o cálice que o Pai me deu?" },
      { ref: "Jo 18:20-21", text: "Eu tenho falado abertamente ao mundo; eu ensinei sempre nas sinagogas e no templo, onde todos os judeus se ajuntam, e nada disse em oculto. Por que me interrogas a mim? Pergunta aos que ouviram o que lhes disse; eis que eles sabem o que eu disse." },
      { ref: "Jo 18:23", text: "Se eu falei mal, dá testemunho do mal; mas, se bem, por que me feres?" },
      { ref: "Jo 18:34", text: "Dizes tu isso de ti mesmo, ou foram outros que to disseram de mim?" },
      { ref: "Jo 18:36-37", text: "O meu reino não é deste mundo; se o meu reino fosse deste mundo, os meus servos lutariam para que eu não fosse entregue aos judeus; mas agora o meu reino não é daqui. Tu dizes que eu sou rei. Eu para isso nasci e para isso vim ao mundo, a fim de dar testemunho da verdade. Todo aquele que é da verdade ouve a minha voz." },
      { ref: "Jo 19:11", text: "Nenhum poder terias sobre mim, se de cima te não fosse dado; por isso quem me entregou a ti tem mais pecado." },
      { ref: "Jo 19:26-27", text: "Mulher, eis aí o teu filho. Eis aí a tua mãe." },
      { ref: "Jo 19:28", text: "Tenho sede." },
      { ref: "Jo 19:30", text: "Está consumado." },
      { ref: "Jo 20:15-17", text: "Mulher, por que choras? A quem buscas? Maria! Não me detenhas, porque ainda não subi para meu Pai; mas vai para meus irmãos, e dize-lhes que eu subo para meu Pai e vosso Pai, meu Deus e vosso Deus." },
      { ref: "Jo 20:19", text: "Paz seja convosco." },
      { ref: "Jo 20:21-23", text: "Paz seja convosco. Assim como o Pai me enviou, também eu vos envio a vós. Recebei o Espírito Santo. Àqueles a quem perdoardes os pecados lhes são perdoados; e àqueles a quem os retiverdes lhes são retidos." },
      { ref: "Jo 20:27", text: "Põe aqui o teu dedo, e olha para as minhas mãos; e chega a tua mão, e põe-na no meu lado; e não sejas incrédulo, mas crente." },
      { ref: "Jo 20:29", text: "Porque me viste, Tomé, creste; bem-aventurados os que não viram e creram." },
      { ref: "Jo 21:5-6", text: "Filhos, tendes acaso alguma coisa de comer? Lançai a rede para o lado direito do barco, e achareis." },
      { ref: "Jo 21:10", text: "Trazei dos peixes que agora colhestes." },
      { ref: "Jo 21:12", text: "Vinde, jantai." },
      { ref: "Jo 21:15-19", text: "Simão, filho de Jonas, amas-me mais do que estes? Apascenta os meus cordeiros. Simão, filho de Jonas, amas-me? Pastoreia as minhas ovelhas. Simão, filho de Jonas, amas-me? Apascenta as minhas ovelhas. Em verdade, em verdade te digo que, quando eras mais moço, tu te cingias a ti mesmo e andavas por onde querias; mas quando fores velho, estenderás as tuas mãos, e outro te cingirá e te levará para onde tu não queiras. Segue-me." },
      { ref: "Jo 21:22", text: "Se eu quiser que ele fique até que eu venha, que te importa a ti? Tu segue-me." },
    ]
  },
  {
    book: "ATOS",
    passages: [
      { ref: "At 1:4-5", text: "Não vos afasteis de Jerusalém, mas esperai a promessa do Pai, que de mim ouvistes. Porque, na verdade, João batizou com água, mas vós sereis batizados com o Espírito Santo, dentro de poucos dias." },
      { ref: "At 1:7-8", text: "Não vos pertence saber os tempos ou as estações que o Pai estabeleceu pelo seu próprio poder. Mas recebereis poder, ao descer sobre vós o Espírito Santo, e ser-me-eis testemunhas tanto em Jerusalém como em toda a Judéia e Samaria e até aos confins da terra." },
      { ref: "At 9:4-6", text: "Saulo, Saulo, por que me persegues? Eu sou Jesus, a quem tu persegues. Mas levanta-te e entra na cidade, e ser-te-á dito o que deves fazer." },
      { ref: "At 9:10-12", text: "Levanta-te e vai à rua chamada Direita, e procura na casa de Judas um homem de Tarso chamado Saulo; pois eis que ele está orando." },
      { ref: "At 9:15-16", text: "Vai, porque este é para mim um vaso escolhido, para levar o meu nome perante os gentios, e os reis, e os filhos de Israel. Porque eu lhe mostrarei quanto deve padecer pelo meu nome." },
      { ref: "At 18:9-10", text: "Não temas, mas fala e não te cales; porque eu sou contigo, e ninguém te acometará para te fazer mal; pois tenho muito povo nesta cidade." },
      { ref: "At 22:7-8", text: "Saulo, Saulo, por que me persegues? Eu sou Jesus, o Nazareno, a quem tu persegues." },
      { ref: "At 22:10", text: "Levanta-te e vai a Damasco, e ali se te dirá tudo o que está ordenado que faças." },
      { ref: "At 22:18,21", text: "Dá-te pressa e sai depressa de Jerusalém; porque não receberão o teu testemunho acerca de mim. Vai, porque eu te enviarei para longe, aos gentios." },
      { ref: "At 23:11", text: "Coragem! Pois como de mim testificaste em Jerusalém, assim importa que testifiques também em Roma." },
      { ref: "At 26:14-18", text: "Saulo, Saulo, por que me persegues? Duro é para ti recalcitrar contra os aguilhões. Eu sou Jesus, a quem tu persegues. Mas levanta-te e põe-te de pé; porque para isto te apareci, para te pôr por ministro e testemunha tanto das coisas que já viste, como daquelas em que ainda te aparecerei; livrando-te deste povo e dos gentios, a quem agora te envio, para lhes abrires os olhos, a fim de se converterem das trevas à luz, e do poder de Satanás a Deus, para que recebam perdão de pecados e herança entre os que são santificados pela fé em mim." },
    ]
  },
  {
    book: "APOCALIPSE",
    passages: [
      { ref: "Ap 1:11", text: "Eu sou o Alfa e o Ômega, o primeiro e o derradeiro; o que vês, escreve-o em um livro, e envia-o às sete igrejas." },
      { ref: "Ap 1:17-20", text: "Não temas; eu sou o primeiro e o último; e o que vive e fui morto, mas eis aqui estou vivo para todo o sempre. Amém. E tenho as chaves da morte e do inferno. Escreve as coisas que tens visto, e as que são, e as que depois destas hão de acontecer." },
      { ref: "Ap 2:1-7", text: "Ao anjo da igreja de Éfeso escreve: Conheço as tuas obras, e o teu trabalho, e a tua paciência, e que não podes sofrer os maus; e puseste à prova os que dizem ser apóstolos, e o não são, e tu os achaste mentirosos. E sofreste, e tens paciência; e trabalhaste pelo meu nome, e não te cansaste. Tenho, porém, contra ti que deixaste o teu primeiro amor. Lembra-te, pois, de onde caíste, e arrepende-te, e pratica as primeiras obras; quando não, brevemente a ti virei, e tirarei do seu lugar o teu castiçal, se não te arrependeres. Tens, porém, isto: que odeias as obras dos nicolaítas, as quais eu também odeio. Quem tem ouvidos, ouça o que o Espírito diz às igrejas: Ao que vencer, dar-lhe-ei a comer da árvore da vida, que está no meio do paraíso de Deus." },
      { ref: "Ap 2:8-11", text: "Ao anjo da igreja de Esmirna escreve: Conheço a tua tribulação, e a tua pobreza (mas tu és rico), e a blasfêmia dos que se dizem judeus, e não o são, mas são a sinagoga de Satanás. Não temas o que hás de padecer. Eis que o diabo está prestes a lançar alguns de vós na prisão, para que sejais tentados; e tereis uma tribulação de dez dias. Sê fiel até à morte e dar-te-ei a coroa da vida. Quem tem ouvidos ouça o que o Espírito diz às igrejas: O que vencer não receberá o dano da segunda morte." },
      { ref: "Ap 2:12-17", text: "Ao anjo da igreja de Pérgamo escreve: Conheço as tuas obras, e onde habitas, que é onde está o trono de Satanás; e reténs o meu nome, e não negaste a minha fé. Mas tenho contra ti algumas coisas, pois que tens lá os que seguem a doutrina de Balaão. Assim tens também os que seguem a doutrina dos nicolaítas. Arrepende-te, pois; quando não, em breve virei a ti, e contra eles batalharei com a espada da minha boca. Quem tem ouvidos ouça o que o Espírito diz às igrejas: Ao que vencer darei eu a comer do maná escondido, e dar-lhe-ei uma pedra branca, e na pedra um novo nome escrito, o qual ninguém conhece senão aquele que o recebe." },
      { ref: "Ap 2:18-29", text: "Ao anjo da igreja de Tiatira escreve: Conheço as tuas obras, e o teu amor, e o teu serviço, e a tua fé, e a tua paciência, e que as tuas últimas obras são mais do que as primeiras. Mas tenho contra ti que toleras Jezabel, mulher que se diz profetisa, para ensinar e enganar os meus servos. E dei-lhe tempo para que se arrependesse, e não se arrependeu. Eis que eu a porei numa cama, e os que adulteram com ela em grande tribulação, se não se arrependerem das suas obras. E todas as igrejas saberão que eu sou o que sonda os rins e os corações; e darei a cada um de vós segundo as suas obras. E ao que vencer e guardar até ao fim as minhas obras, eu lhe darei poder sobre as nações. E dar-lhe-ei a estrela da manhã. Quem tem ouvidos, ouça o que o Espírito diz às igrejas." },
      { ref: "Ap 3:1-6", text: "Ao anjo da igreja de Sardes escreve: Conheço as tuas obras, que tens nome de que vives, e estás morto. Sê vigilante, e confirma as demais coisas que estavam para morrer; porque não achei as tuas obras perfeitas diante de Deus. Lembra-te, pois, do que tens recebido e ouvido, e guarda-o, e arrepende-te. E, se não vigiares, virei sobre ti como um ladrão, e não saberás a que hora sobre ti virei. Mas também tens em Sardes algumas pessoas que não contaminaram as suas vestes, e comigo andarão de branco; porquanto são dignas disso. O que vencer será vestido de vestes brancas, e de maneira nenhuma riscarei o seu nome do livro da vida; e confessarei o seu nome diante de meu Pai e diante dos seus anjos. Quem tem ouvidos, ouça o que o Espírito diz às igrejas." },
      { ref: "Ap 3:7-13", text: "Ao anjo da igreja de Filadélfia escreve: Conheço as tuas obras; eis que diante de ti pus uma porta aberta, e ninguém a pode fechar; tendo pouca força, guardaste a minha palavra, e não negaste o meu nome. Eis que eu farei aos da sinagoga de Satanás, que se dizem judeus e não o são, mas mentem: eis que eu farei que venham, e adorem prostrados a teus pés, e saibam que eu te amo. Como guardaste a palavra da minha paciência, também eu te guardarei da hora da tentação que há de vir sobre todo o mundo, para tentar os que habitam na terra. Eis que venho sem demora; guarda o que tens, para que ninguém tome a tua coroa. A quem vencer, eu o farei coluna no templo do meu Deus, e dele nunca sairá; e escreverei sobre ele o nome do meu Deus, e o nome da cidade do meu Deus, a nova Jerusalém, que desce do céu, do meu Deus, e também o meu novo nome. Quem tem ouvidos, ouça o que o Espírito diz às igrejas." },
      { ref: "Ap 3:14-22", text: "Ao anjo da igreja de Laodicéia escreve: Conheço as tuas obras, que nem és frio nem quente; oxalá foras frio ou quente! Assim, porque és morno, e não és frio nem quente, vomitar-te-ei da minha boca. Como dizes: Rico sou, e estou enriquecido, e de nada necessito; e não sabes que és desgraçado, e miserável, e pobre, e cego, e nu; aconselho-te que de mim compres ouro provado no fogo, para que te enriqueças; e vestes brancas, para que te vistas, e não apareça a vergonha da tua nudez; e colírio, para que untes os teus olhos, para que vejas. Eu repreendo e castigo a todos quantos amo; sê pois zeloso, e arrepende-te. Eis que estou à porta, e bato; se alguém ouvir a minha voz, e abrir a porta, entrarei em sua casa, e com ele cearei, e ele comigo. Ao que vencer lhe concederei que se assente comigo no meu trono; assim como eu venci, e me assentei com meu Pai no seu trono. Quem tem ouvidos, ouça o que o Espírito diz às igrejas." },
      { ref: "Ap 16:15", text: "Eis que venho como ladrão. Bem-aventurado aquele que vigia e guarda as suas vestes, para que não ande nu, e não se veja a sua vergonha." },
      { ref: "Ap 21:5-8", text: "Eis que faço novas todas as coisas. Escreve, porque estas palavras são verdadeiras e fiéis. Está cumprido. Eu sou o Alfa e o Ômega, o princípio e o fim. A quem tiver sede eu darei de graça da fonte da água da vida. Quem vencer herdará todas as coisas, e eu serei seu Deus e ele será meu filho. Mas quanto aos medrosos, e aos incrédulos, e aos abomináveis, e aos homicidas, e aos fornicários, e aos feiticeiros, e aos idólatras, e a todos os mentirosos, a sua parte será no lago que arde com fogo e enxofre, o que é a segunda morte." },
      { ref: "Ap 22:7", text: "Eis que venho sem demora; bem-aventurado aquele que guarda as palavras da profecia deste livro." },
      { ref: "Ap 22:12-13", text: "Eis que venho sem demora, e comigo está o galardão que tenho para retribuir a cada um segundo as suas obras. Eu sou o Alfa e o Ômega, o primeiro e o derradeiro, o princípio e o fim." },
      { ref: "Ap 22:16", text: "Eu, Jesus, enviei o meu anjo, para vos testificar estas coisas nas igrejas. Eu sou a raiz e a geração de Davi, a resplandecente estrela da manhã." },
      { ref: "Ap 22:20", text: "Certamente cedo venho." },
    ]
  },
];
'''
    txt_ok += remaining

# Gravar o TXT corrigido
with open(TXT_PATH, 'w', encoding='utf-8') as f:
    f.write(txt_ok)
print(f"TXT atualizado: {TXT_PATH}")

# ── 2. Extrair sections_data do TXT final ───────────────────────────────
# Localizar o bloco sections_data no TXT
sd_start = txt_ok.find('const sections_data = [')
if sd_start == -1:
    raise RuntimeError("sections_data não encontrado no TXT")
sd_end = txt_ok.rfind('];')
if sd_end == -1:
    raise RuntimeError("Fechamento de sections_data não encontrado")
sections_block = txt_ok[sd_start:sd_end+2]

# Contar passagens
import json
passage_count = sections_block.count('ref:')
print(f"Total de passagens no TXT final: {passage_count}")

# ── 3. Gerar o HTML completo ────────────────────────────────────────────
# Determinar quais livros existem para gerar nav e filtros
books_in_data = []
for m in re.finditer(r'book:\s*"([^"]+)"', sections_block):
    b = m.group(1)
    if b not in books_in_data:
        books_in_data.append(b)

# Mapear sigla para nav
book_abbrev = {
    "MATEUS": "Mt", "MARCOS": "Mc", "LUCAS": "Lc",
    "JOÃO": "Jo", "ATOS": "At", "APOCALIPSE": "Ap"
}
book_anchors = {
    "MATEUS": "mateus", "MARCOS": "marcos", "LUCAS": "lucas",
    "JOÃO": "joao", "ATOS": "atos", "APOCALIPSE": "apocalipse"
}

nav_links = '\n'.join(
    f'            <a href="#{book_anchors.get(b, b.lower())}">{b.title()}</a>'
    for b in books_in_data
)

filter_btns = '\n'.join(
    f'            <button class="filter-btn" data-book="{b}">{book_abbrev.get(b, b[:2])}</button>'
    for b in books_in_data
)

html = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Falas de Jesus — Todas as Palavras do Cristo na Bíblia</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <style>
        :root {{
            --bg: #0c0a09;
            --bg2: #1c1917;
            --bg3: #292524;
            --bg4: #44403c;
            --border: #44403c;
            --text: #fafaf9;
            --text2: #a8a29e;
            --text3: #78716c;
            --gold: #f59e0b;
            --gold2: #fbbf24;
            --gold-dim: rgba(245,158,11,0.12);
            --red: #ef4444;
            --red-dim: rgba(239,68,68,0.1);
            --radius: 12px;
        }}
        * {{ margin:0; padding:0; box-sizing:border-box; }}
        html {{ scroll-behavior:smooth; }}
        body {{
            font-family:'Inter',-apple-system,sans-serif;
            background:var(--bg); color:var(--text); line-height:1.7;
        }}
        .topnav {{
            position:fixed; top:0; left:0; right:0;
            background:rgba(12,10,9,0.92); backdrop-filter:blur(14px);
            border-bottom:1px solid var(--border); z-index:999; padding:0 2rem;
        }}
        .topnav-inner {{
            max-width:900px; margin:0 auto;
            display:flex; align-items:center; justify-content:space-between; height:56px;
        }}
        .topnav .logo {{
            font-weight:800; font-size:1rem;
            background:linear-gradient(135deg,var(--gold),var(--red));
            -webkit-background-clip:text; -webkit-text-fill-color:transparent;
            text-decoration:none;
        }}
        .topnav-links {{ display:flex; gap:0.25rem; overflow-x:auto; scrollbar-width:none; }}
        .topnav-links::-webkit-scrollbar {{ display:none; }}
        .topnav-links a {{
            color:var(--text2); text-decoration:none; font-size:0.75rem;
            padding:0.4rem 0.65rem; border-radius:6px; white-space:nowrap; transition:all .2s;
        }}
        .topnav-links a:hover,.topnav-links a.active {{ color:var(--gold); background:var(--gold-dim); }}
        .container {{ max-width:900px; margin:0 auto; padding:80px 1.5rem 4rem; }}
        .hero {{ text-align:center; padding:3rem 0 2rem; }}
        .hero h1 {{
            font-size:2.4rem; font-weight:800;
            background:linear-gradient(135deg,var(--gold),#dc2626);
            -webkit-background-clip:text; -webkit-text-fill-color:transparent;
            margin-bottom:.5rem;
        }}
        .hero p {{ color:var(--text2); font-size:1rem; max-width:600px; margin:0 auto 1.5rem; }}
        .hero-stats {{ display:flex; gap:2rem; justify-content:center; flex-wrap:wrap; }}
        .hero-stat {{ text-align:center; }}
        .hero-stat .num {{ font-size:2rem; font-weight:800; color:var(--gold); }}
        .hero-stat .label {{ font-size:.78rem; color:var(--text2); }}
        .search-wrap {{
            position:sticky; top:56px; z-index:99;
            background:rgba(12,10,9,0.95); backdrop-filter:blur(14px);
            padding:1rem 0; border-bottom:1px solid var(--border);
        }}
        .search-bar {{
            display:flex; gap:.5rem; max-width:900px; margin:0 auto; padding:0 1.5rem;
            flex-wrap:wrap;
        }}
        .search-bar input {{
            flex:1; min-width:200px; padding:.65rem 1rem;
            background:var(--bg2); border:1px solid var(--border); border-radius:8px;
            color:var(--text); font-size:.9rem; outline:none; transition:border .2s;
        }}
        .search-bar input:focus {{ border-color:var(--gold); }}
        .search-bar input::placeholder {{ color:var(--text3); }}
        .filter-btns {{ display:flex; gap:.35rem; flex-wrap:wrap; }}
        .filter-btn {{
            padding:.45rem .75rem; border-radius:6px; font-size:.75rem; font-weight:600;
            border:1px solid var(--border); background:var(--bg2); color:var(--text2);
            cursor:pointer; transition:all .2s; white-space:nowrap;
        }}
        .filter-btn:hover {{ border-color:var(--gold); color:var(--gold); }}
        .filter-btn.active {{ background:var(--gold-dim); border-color:var(--gold); color:var(--gold); }}
        .results-count {{
            font-size:.78rem; color:var(--text3); padding:.4rem 0 0;
            max-width:900px; margin:0 auto; padding-left:1.5rem;
        }}
        .book-section {{ margin-bottom:3rem; scroll-margin-top:130px; }}
        .book-title {{
            font-size:1.3rem; font-weight:700; margin-bottom:1rem;
            display:flex; align-items:center; gap:.6rem;
            position:sticky; top:120px; z-index:10;
            background:var(--bg); padding:.75rem 0;
        }}
        .book-title .count {{
            font-size:.65rem; background:var(--gold); color:#000;
            padding:.15rem .5rem; border-radius:4px; font-weight:700;
        }}
        .passage {{
            background:var(--bg2); border:1px solid var(--border);
            border-radius:var(--radius); padding:1.25rem 1.5rem;
            margin-bottom:.75rem; transition:border .2s;
        }}
        .passage:hover {{ border-color:var(--gold); }}
        .passage-ref {{
            font-size:.72rem; font-weight:700; color:var(--gold);
            text-transform:uppercase; letter-spacing:.04em; margin-bottom:.4rem;
            display:flex; align-items:center; gap:.5rem;
        }}
        .passage-ref .tag-dup {{
            font-size:.6rem; background:var(--red-dim); color:var(--red);
            padding:.1rem .4rem; border-radius:3px; font-weight:600;
        }}
        .passage-text {{
            font-family:'Crimson Pro',Georgia,serif; font-size:1.08rem;
            line-height:1.85; color:var(--text);
        }}
        .passage-text mark {{
            background:var(--gold-dim); color:var(--gold2);
            border-radius:2px; padding:0 2px;
        }}
        .passage.hidden {{ display:none; }}
        .back-top {{
            position:fixed; bottom:2rem; right:2rem;
            width:44px; height:44px; border-radius:50%;
            background:var(--gold); color:#000; border:none;
            font-size:1.2rem; cursor:pointer; display:none;
            align-items:center; justify-content:center;
            box-shadow:0 4px 16px rgba(0,0,0,.4); z-index:99;
        }}
        .back-top.visible {{ display:flex; }}
        .note {{
            background:var(--gold-dim); border-left:3px solid var(--gold);
            border-radius:0 8px 8px 0; padding:1rem 1.25rem; margin:1.5rem 0;
        }}
        .note p {{ color:var(--text); font-size:.88rem; margin:0; }}
        .note strong {{ color:var(--gold); }}
        @media(max-width:600px) {{
            .container {{ padding:70px 1rem 3rem; }}
            .hero h1 {{ font-size:1.6rem; }}
            .passage-text {{ font-size:1rem; }}
            .search-bar {{ padding:0 1rem; }}
            .book-title {{ top:110px; }}
        }}
    </style>
</head>
<body>

<nav class="topnav">
    <div class="topnav-inner">
        <a href="index.html" class="logo">← Módulos</a>
        <div class="topnav-links">
{nav_links}
        </div>
    </div>
</nav>

<div class="search-wrap">
    <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Buscar nas falas de Jesus... (ex: amor, fé, oração, perdão)">
        <div class="filter-btns">
            <button class="filter-btn active" data-book="all">Todos</button>
{filter_btns}
            <button class="filter-btn" data-book="unique">Sem duplicatas</button>
        </div>
    </div>
    <div class="results-count" id="resultsCount"></div>
</div>

<div class="container">
    <div class="hero">
        <h1>Falas de Jesus</h1>
        <p>Todas as palavras do Cristo registradas na Bíblia Sagrada — Evangelhos, Atos e Apocalipse</p>
        <div class="hero-stats">
            <div class="hero-stat"><div class="num" id="totalCount">0</div><div class="label">Total de Passagens</div></div>
            <div class="hero-stat"><div class="num" id="uniqueCount">0</div><div class="label">Passagens Únicas</div></div>
            <div class="hero-stat"><div class="num">{len(books_in_data)}</div><div class="label">Livros</div></div>
        </div>
    </div>
    <div id="content"></div>
</div>

<button class="back-top" id="backTop" onclick="window.scrollTo({{top:0}})">↑</button>

<script>
// ============================================================
// DADOS — Todas as falas de Jesus na Bíblia
// ============================================================
{sections_block}

// ============================================================
// DEDUPLICAÇÃO — mapeia paralelos sinóticos
// ============================================================
function isDuplicate(p) {{
    return !!p.dup;
}}

// ============================================================
// RENDER
// ============================================================
const contentEl = document.getElementById('content');
const searchInput = document.getElementById('searchInput');
const totalCountEl = document.getElementById('totalCount');
const uniqueCountEl = document.getElementById('uniqueCount');
const resultsCountEl = document.getElementById('resultsCount');
const filterBtns = document.querySelectorAll('.filter-btn');
const backTop = document.getElementById('backTop');

let activeBook = 'all';
let allPassageEls = [];

function buildContent() {{
    let totalPassages = 0;
    let uniquePassages = 0;

    sections_data.forEach(section => {{
        const sectionEl = document.createElement('section');
        sectionEl.className = 'book-section';
        sectionEl.id = section.book.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").replace(/\\s/g,'');

        const titleEl = document.createElement('h2');
        titleEl.className = 'book-title';
        titleEl.innerHTML = `📖 ${{section.book}} <span class="count">${{section.passages.length}} passagens</span>`;
        sectionEl.appendChild(titleEl);

        section.passages.forEach(p => {{
            totalPassages++;
            const div = document.createElement('div');
            div.className = 'passage';
            div.dataset.book = section.book;
            div.dataset.ref = p.ref;
            div.dataset.text = p.text.toLowerCase();
            div.dataset.dup = p.dup || '';

            let refHtml = p.ref;
            if (p.dup) {{
                refHtml += ` <span class="tag-dup">≈ ${{p.dup}}</span>`;
            }} else {{
                uniquePassages++;
            }}

            div.innerHTML = `
                <div class="passage-ref">${{refHtml}}</div>
                <div class="passage-text">${{p.text}}</div>
            `;
            sectionEl.appendChild(div);
            allPassageEls.push(div);
        }});

        contentEl.appendChild(sectionEl);
    }});

    totalCountEl.textContent = totalPassages;
    uniqueCountEl.textContent = uniquePassages;
}}

function applyFilters() {{
    const query = searchInput.value.toLowerCase().trim();
    let visible = 0;

    allPassageEls.forEach(el => {{
        let show = true;

        if (activeBook === 'unique') {{
            if (el.dataset.dup) show = false;
        }} else if (activeBook !== 'all') {{
            if (el.dataset.book !== activeBook) show = false;
        }}

        if (show && query) {{
            if (!el.dataset.text.includes(query) && !el.dataset.ref.toLowerCase().includes(query)) {{
                show = false;
            }}
        }}

        el.classList.toggle('hidden', !show);
        if (show) visible++;

        const textEl = el.querySelector('.passage-text');
        const origText = sections_data
            .flatMap(s => s.passages)
            .find(p => p.ref === el.dataset.ref)?.text || '';

        if (query && show) {{
            const regex = new RegExp(`(${{query.replace(/[.*+?^${{}}()|[\\]\\\\]/g,'\\\\$&')}})`, 'gi');
            textEl.innerHTML = origText.replace(regex, '<mark>$1</mark>');
        }} else {{
            textEl.innerHTML = origText;
        }}
    }});

    document.querySelectorAll('.book-section').forEach(sec => {{
        const hasVisible = sec.querySelectorAll('.passage:not(.hidden)').length > 0;
        sec.style.display = hasVisible ? '' : 'none';
    }});

    resultsCountEl.textContent = query || activeBook !== 'all'
        ? `${{visible}} passagen${{visible !== 1 ? 's' : ''}} encontrada${{visible !== 1 ? 's' : ''}}`
        : '';
}}

searchInput.addEventListener('input', applyFilters);

filterBtns.forEach(btn => {{
    btn.addEventListener('click', () => {{
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeBook = btn.dataset.book;
        applyFilters();
    }});
}});

window.addEventListener('scroll', () => {{
    backTop.classList.toggle('visible', window.scrollY > 600);
}});

buildContent();
</script>
</body>
</html>'''

with open(HTML_PATH, 'w', encoding='utf-8') as f:
    f.write(html)
print(f"HTML regenerado: {HTML_PATH}")

# ── 4. Contagens finais ─────────────────────────────────────────────────
for b in books_in_data:
    cnt = len(re.findall(r'ref:', sections_block[sections_block.find(f'book: "{b}"'):sections_block.find(']', sections_block.find(f'book: "{b}"') + 100) if sections_block.find(']', sections_block.find(f'book: "{b}"') + 100) != -1 else len(sections_block)]))
    # Simpler count
    pass

# Simple total
total = sections_block.count('ref:')
print(f"\n=== RESULTADO FINAL ===")
print(f"Livros: {', '.join(books_in_data)}")
print(f"Total de passagens: {total}")
print("Concluído com sucesso!")
