cobData = [
  {'op':'Op 1',  'cpc':95,  'conv':19,'env':19,'pago':14,'qual':0.78,'icm':2.02,'abs':0},
  {'op':'Op 2',  'cpc':120, 'conv':24,'env':24,'pago':16,'qual':1.00,'icm':1.88,'abs':0},
  {'op':'Op 3',  'cpc':121, 'conv':14,'env':14,'pago':7, 'qual':0.78,'icm':0.66,'abs':0},
  {'op':'Op 4',  'cpc':98,  'conv':12,'env':12,'pago':11,'qual':0.95,'icm':0.52,'abs':0},
  {'op':'Op 5',  'cpc':73,  'conv':11,'env':11,'pago':8, 'qual':0.92,'icm':0.38,'abs':0},
  {'op':'Op 6',  'cpc':98,  'conv':15,'env':15,'pago':11,'qual':0.94,'icm':2.55,'abs':1},
  {'op':'Op 7',  'cpc':99,  'conv':3, 'env':3, 'pago':1, 'qual':0.38,'icm':0.04,'abs':0},
  {'op':'Op 8',  'cpc':95,  'conv':12,'env':12,'pago':5, 'qual':0.87,'icm':0.35,'abs':0},
  {'op':'Op 9',  'cpc':121, 'conv':34,'env':34,'pago':16,'qual':0.98,'icm':0.65,'abs':0},
  {'op':'Op 10', 'cpc':69,  'conv':23,'env':23,'pago':21,'qual':0.83,'icm':1.45,'abs':0},
  {'op':'Op 11', 'cpc':78,  'conv':13,'env':13,'pago':11,'qual':0.71,'icm':0.38,'abs':0},
  {'op':'Op 12', 'cpc':129, 'conv':12,'env':12,'pago':10,'qual':0.78,'icm':0.49,'abs':0},
  {'op':'Op 13', 'cpc':98,  'conv':12,'env':12,'pago':10,'qual':0.78,'icm':0.39,'abs':0},
  {'op':'Op 14', 'cpc':129, 'conv':28,'env':28,'pago':23,'qual':0.78,'icm':0.85,'abs':0},
  {'op':'Op 15', 'cpc':50,  'conv':36,'env':36,'pago':29,'qual':1.00,'icm':1.44,'abs':0},
  {'op':'Op 16', 'cpc':77,  'conv':12,'env':12,'pago':9, 'qual':0.91,'icm':0.47,'abs':0},
  {'op':'Op 17', 'cpc':150, 'conv':4, 'env':4, 'pago':3, 'qual':0.70,'icm':0.15,'abs':0},
  {'op':'Op 18', 'cpc':250, 'conv':49,'env':49,'pago':36,'qual':1.00,'icm':4.01,'abs':0},
  {'op':'Op 19', 'cpc':95,  'conv':43,'env':43,'pago':31,'qual':0.73,'icm':1.41,'abs':0},
  {'op':'Op 20', 'cpc':120, 'conv':21,'env':21,'pago':15,'qual':0.82,'icm':0.50,'abs':0},
  {'op':'Op 21', 'cpc':121, 'conv':33,'env':33,'pago':23,'qual':0.92,'icm':0.83,'abs':0},
  {'op':'Op 22', 'cpc':98,  'conv':23,'env':23,'pago':16,'qual':0.65,'icm':0.98,'abs':0},
  {'op':'Op 23', 'cpc':73,  'conv':13,'env':13,'pago':9, 'qual':0.51,'icm':0.37,'abs':0},
  {'op':'Op 24', 'cpc':83,  'conv':35,'env':35,'pago':24,'qual':0.95,'icm':1.05,'abs':0},
  {'op':'Op 25', 'cpc':98,  'conv':27,'env':27,'pago':18,'qual':0.96,'icm':0.69,'abs':0},
  {'op':'Op 26', 'cpc':69,  'conv':32,'env':32,'pago':21,'qual':0.79,'icm':0.87,'abs':1},
  {'op':'Op 27', 'cpc':129, 'conv':45,'env':45,'pago':29,'qual':0.81,'icm':1.09,'abs':0},
  {'op':'Op 28', 'cpc':98,  'conv':44,'env':44,'pago':28,'qual':0.88,'icm':1.08,'abs':0},
  {'op':'Op 29', 'cpc':129, 'conv':63,'env':63,'pago':40,'qual':0.81,'icm':1.44,'abs':0},
  {'op':'Op 30', 'cpc':99,  'conv':23,'env':23,'pago':14,'qual':0.82,'icm':0.55,'abs':0},
  {'op':'Op 31', 'cpc':50,  'conv':5, 'env':5, 'pago':3, 'qual':0.84,'icm':0.21,'abs':0},
  {'op':'Op 32', 'cpc':121, 'conv':32,'env':32,'pago':19,'qual':0.80,'icm':0.71,'abs':0},
  {'op':'Op 33', 'cpc':98,  'conv':28,'env':28,'pago':16,'qual':0.84,'icm':0.69,'abs':3},
  {'op':'Op 34', 'cpc':73,  'conv':30,'env':30,'pago':17,'qual':0.92,'icm':0.81,'abs':0},
  {'op':'Op 35', 'cpc':83,  'conv':16,'env':16,'pago':9, 'qual':0.86,'icm':0.29,'abs':0},
  {'op':'Op 36', 'cpc':98,  'conv':38,'env':38,'pago':21,'qual':0.79,'icm':1.24,'abs':0},
  {'op':'Op 37', 'cpc':69,  'conv':29,'env':29,'pago':16,'qual':0.84,'icm':0.70,'abs':0},
  {'op':'Op 38', 'cpc':98,  'conv':48,'env':48,'pago':26,'qual':0.78,'icm':1.13,'abs':2},
  {'op':'Op 39', 'cpc':129, 'conv':29,'env':29,'pago':15,'qual':0.90,'icm':0.66,'abs':0},
  {'op':'Op 40', 'cpc':50,  'conv':18,'env':18,'pago':9, 'qual':0.71,'icm':0.26,'abs':0},
  {'op':'Op 41', 'cpc':98,  'conv':27,'env':27,'pago':12,'qual':0.85,'icm':0.44,'abs':0},
  {'op':'Op 42', 'cpc':73,  'conv':7, 'env':7, 'pago':3, 'qual':0.76,'icm':0.11,'abs':0},
  {'op':'Op 43', 'cpc':83,  'conv':27,'env':27,'pago':11,'qual':0.48,'icm':0.40,'abs':0},
  {'op':'Op 44', 'cpc':78,  'conv':3, 'env':3, 'pago':0, 'qual':0.75,'icm':0.00,'abs':0},
  {'op':'Op 45', 'cpc':129, 'conv':22,'env':22,'pago':11,'qual':0.00,'icm':0.65,'abs':0},
  {'op':'Op 46', 'cpc':129, 'conv':26,'env':26,'pago':10,'qual':0.62,'icm':1.43,'abs':0},
  {'op':'Op 47', 'cpc':50,  'conv':9, 'env':9, 'pago':6, 'qual':0.42,'icm':0.41,'abs':0},
  {'op':'Op 48', 'cpc':95,  'conv':6, 'env':6, 'pago':5, 'qual':0.91,'icm':0.58,'abs':0},
  {'op':'Op 49', 'cpc':120, 'conv':15,'env':15,'pago':7, 'qual':0.31,'icm':1.83,'abs':0},
  {'op':'Op 50', 'cpc':121, 'conv':10,'env':10,'pago':4, 'qual':0.45,'icm':0.23,'abs':0},
  {'op':'Op 51', 'cpc':98,  'conv':7, 'env':7, 'pago':1, 'qual':0.81,'icm':0.28,'abs':1},
  {'op':'Op 52', 'cpc':50,  'conv':14,'env':14,'pago':9, 'qual':0.96,'icm':1.11,'abs':0},
  {'op':'Op 53', 'cpc':60,  'conv':9, 'env':9, 'pago':1, 'qual':0.85,'icm':0.24,'abs':0},
]

total_cpc = sum(d['cpc'] for d in cobData)
total_conv = sum(d['conv'] for d in cobData)
total_env = sum(d['env'] for d in cobData)
total_pago = sum(d['pago'] for d in cobData)
ef_media = total_pago/total_env
icm_medio = sum(d['icm'] for d in cobData)/len(cobData)
abs_ops = len([d for d in cobData if d['abs']>0])

print(f"CPC total: {total_cpc} (dashboard: 5.215)")
print(f"Convertidos: {total_conv} (dashboard: 1.190)")
print(f"Enviados: {total_env}")
print(f"Pagos: {total_pago} (dashboard: 740)")
print(f"Eficiencia media: {ef_media:.1%} (dashboard: 62%)")
print(f"ICM medio cob: {icm_medio:.2f} (dashboard: 0,83)")
print(f"Abs c/ falta: {abs_ops} (dashboard: 5)")
print(f"Taxa conv media: {total_conv/total_cpc:.1%} (dashboard: 22,8%)")
print()

for d in cobData:
    if d['op'] in ['Op 7','Op 42','Op 44']:
        below = d['icm'] < 0.15
        print(f"{d['op']}: ICM={d['icm']} below_0.15={below}")
print()

op45 = next(d for d in cobData if d['op']=='Op 45')
print(f"Op 45: env={op45['env']}, pago={op45['pago']}, ef={op45['pago']/op45['env']:.0%}, qual={op45['qual']}")
print()

sorted_icm = sorted(cobData, key=lambda d: d['icm'], reverse=True)
top20pct = sorted_icm[:round(len(cobData)*0.2)]
top_icm_sum = sum(d['icm'] for d in top20pct)
total_icm_sum = sum(d['icm'] for d in cobData)
print(f"Top 20% ({len(top20pct)} ops) ICM share: {top_icm_sum/total_icm_sum:.0%} (insight: >40%)")
