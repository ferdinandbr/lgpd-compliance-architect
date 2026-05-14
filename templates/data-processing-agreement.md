# Acordo de Processamento de Dados (DPA)

> Exigido pela LGPD (Art. 50) sempre que um Controlador compartilha dados pessoais com um Operador.
> Preencha as seções marcadas com [COLCHETES] antes de usar.

**Versão:** 1.0
**Data de vigência:** [DATA]

---

## Partes

**CONTROLADOR**
Razão social: [NOME DA EMPRESA CONTROLADORA]
CNPJ: [CNPJ]
Endereço: [ENDEREÇO]
Representante legal: [NOME]
Encarregado (DPO): [NOME E E-MAIL]

**OPERADOR**
Razão social: [NOME DA EMPRESA OPERADORA]
CNPJ: [CNPJ]
Endereço: [ENDEREÇO]
Representante legal: [NOME]
Contato de privacidade: [E-MAIL]

Doravante denominados coletivamente "Partes".

---

## 1. Objeto

Este Acordo regula o tratamento de dados pessoais realizado pelo **Operador** em nome do **Controlador**, nos termos da Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018) e do contrato principal entre as Partes celebrado em [DATA DO CONTRATO PRINCIPAL].

---

## 2. Descrição do Tratamento

| Campo | Detalhe |
|---|---|
| **Finalidade** | [Ex.: processamento de pagamentos, envio de e-mails transacionais, hospedagem de dados] |
| **Categorias de dados pessoais** | [Ex.: nome, e-mail, CPF, dados de pagamento] |
| **Categorias de titulares** | [Ex.: clientes, funcionários, leads] |
| **Volume estimado** | [Ex.: até 50.000 titulares] |
| **Duração do tratamento** | [Ex.: vigência do contrato principal + 90 dias para exclusão] |
| **Base legal** | [Ex.: contrato (Art. 7º, V), consentimento (Art. 7º, I)] |

---

## 3. Obrigações do Operador

O Operador se compromete a:

### 3.1 Instrução documentada
Tratar os dados pessoais **exclusivamente** de acordo com as instruções documentadas do Controlador, salvo obrigação legal em contrário — neste caso, comunicando o Controlador imediatamente (salvo se proibido por lei).

### 3.2 Confidencialidade
Garantir que as pessoas autorizadas a tratar os dados estejam sujeitas a obrigações de confidencialidade, seja contratual ou legal.

### 3.3 Segurança
Implementar e manter medidas técnicas e organizacionais adequadas, incluindo no mínimo:

- Criptografia em repouso (AES-256) e em trânsito (TLS 1.2+)
- Controle de acesso baseado no princípio do menor privilégio
- Registro de auditoria de acessos a dados pessoais
- Processo documentado de resposta a incidentes

### 3.4 Suboperadores
Não subcontratar outro operador para tratamento de dados pessoais do Controlador sem:
- Autorização prévia e por escrito do Controlador, ou
- Notificação com antecedência mínima de **30 dias**, permitindo ao Controlador se opor

Quando autorizado, o Operador deve impor ao suboperador obrigações equivalentes às deste Acordo.

### 3.5 Direitos dos titulares
Auxiliar o Controlador, por meios técnicos razoáveis, no atendimento a requisições de titulares (acesso, correção, exclusão, portabilidade, oposição), dentro do prazo de **5 dias úteis** após solicitação.

### 3.6 Incidentes de segurança
Notificar o Controlador **em até 24 horas** após tomar conhecimento de qualquer violação de dados pessoais, fornecendo:

- Descrição do incidente
- Categorias e volume estimado de dados e titulares afetados
- Medidas tomadas ou planejadas para mitigação

### 3.7 Avaliação de impacto (RIPD)
Auxiliar o Controlador na elaboração de Relatório de Impacto à Proteção de Dados (RIPD) quando solicitado.

### 3.8 Exclusão e devolução
Ao término do contrato ou mediante solicitação do Controlador:
- Excluir ou devolver todos os dados pessoais no prazo de **30 dias**
- Fornecer confirmação escrita da exclusão
- Reter dados apenas quando obrigado por lei, informando o Controlador sobre quais e por quanto tempo

### 3.9 Auditoria
Permitir e contribuir com auditorias conduzidas pelo Controlador ou por auditor independente por ele designado, com aviso prévio de **10 dias úteis**.

---

## 4. Obrigações do Controlador

O Controlador se compromete a:

- Fornecer ao Operador apenas os dados estritamente necessários para a finalidade contratada
- Garantir que existe base legal válida para o tratamento delegado
- Comunicar ao Operador qualquer alteração nos dados transferidos que possa afetar a conformidade
- Responder aos titulares pelas atividades de tratamento de dados realizadas pelo Operador

---

## 5. Transferência Internacional de Dados

O Operador somente poderá transferir dados pessoais para fora do Brasil se:

- [ ] O país de destino oferece nível de proteção adequado reconhecido pela ANPD
- [ ] Foram adotadas cláusulas contratuais padrão aprovadas pela ANPD
- [ ] O Controlador forneceu autorização expressa por escrito

---

## 6. Dados Sensíveis

Caso o tratamento envolva dados pessoais sensíveis (saúde, biometria, origem racial, convicção religiosa, opinião política, dado genético ou orientação sexual), o Operador deverá aplicar controles adicionais:

- Acesso restrito a pessoal estritamente necessário
- Criptografia de nível elevado (incluindo em nível de coluna no banco de dados)
- Auditoria de cada acesso individualmente registrada

---

## 7. Vigência e Rescisão

Este Acordo entra em vigor na data de assinatura e permanece válido enquanto o contrato principal estiver em vigor. Em caso de rescisão, aplicam-se as obrigações de exclusão previstas na cláusula 3.8.

---

## 8. Responsabilidade

Cada Parte é responsável pelos danos causados por violações das obrigações que lhe cabem neste Acordo. O Operador responde solidariamente com o Controlador quando agir fora das instruções lícitas ou em desacordo com a LGPD (Art. 42, § 1º).

---

## 9. Lei Aplicável

Este Acordo é regido pela legislação brasileira, em especial pela LGPD (Lei 13.709/2018) e suas regulamentações emitidas pela ANPD. Fica eleito o foro da Comarca de **[CIDADE/ESTADO]**.

---

## 10. Assinaturas

| | Controlador | Operador |
|---|---|---|
| **Nome** | | |
| **Cargo** | | |
| **Data** | | |
| **Assinatura** | | |

---

## Anexo A — Medidas de Segurança Técnicas e Organizacionais

Liste aqui as medidas concretas que o Operador aplica:

| Controle | Implementado | Evidência |
|---|---|---|
| Criptografia em repouso (AES-256) | [ ] Sim / [ ] Não | |
| TLS 1.2+ em trânsito | [ ] Sim / [ ] Não | |
| Autenticação multifator para acesso privilegiado | [ ] Sim / [ ] Não | |
| Controle de acesso baseado em função (RBAC) | [ ] Sim / [ ] Não | |
| Registro de auditoria de acessos | [ ] Sim / [ ] Não | |
| Plano de resposta a incidentes documentado | [ ] Sim / [ ] Não | |
| Testes de penetração anuais | [ ] Sim / [ ] Não | |
| Treinamento de privacidade para equipe | [ ] Sim / [ ] Não | |
| Política de retenção e exclusão automatizada | [ ] Sim / [ ] Não | |

---

## Anexo B — Suboperadores Autorizados

| Suboperador | País | Finalidade | Garantia de Adequação |
|---|---|---|---|
| [Ex.: AWS] | EUA | Hospedagem | SCCs / adequação ANPD |
| [Ex.: SendGrid] | EUA | E-mail transacional | SCCs |
| | | | |
