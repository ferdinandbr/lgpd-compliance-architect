# Fluxo de Consentimento

## Fluxo Padrão de Coleta de Consentimento

```
1. Usuário chega a um ponto de coleta de dados (cadastro, opt-in de marketing, etc.)
2. Apresentar uma solicitação de consentimento clara, em linguagem simples — específica para a finalidade
3. NÃO marcar checkboxes previamente
4. Usuário aceita de forma ativa (ação explícita obrigatória)
5. Sistema registra:
   - user_id
   - finalidade (ex.: "marketing", "analytics", "profiling")
   - versao_politica (ex.: "politica-privacidade-v2.1")
   - canal (web / mobile / API)
   - ip_hash (endereço IP em hash ou mascarado)
   - timestamp (UTC, ISO 8601)
6. Tratamento inicia somente após o registro ser gravado
7. Confirmação enviada ao usuário (e-mail ou notificação no app)
```

## Schema do Registro de Consentimento

```json
{
  "consent_id": "uuid",
  "user_id": "uuid",
  "finalidade": "marketing",
  "versao_politica": "2.1",
  "canal": "web",
  "ip_hash": "sha256(ip)",
  "concedido_em": "2026-05-14T12:00:00Z",
  "revogado_em": null,
  "status": "ativo"
}
```

## Fluxo de Revogação

```
1. Usuário solicita revogação (Configurações > Privacidade, ou e-mail ao DPO)
2. Sistema define revogado_em = NOW() e status = "revogado"
3. Todo tratamento ativo para essa finalidade cessa imediatamente
4. Dado sinalizado para anonimização ou exclusão conforme política de retenção
5. Confirmação enviada ao usuário em até 24 horas
6. Evento de auditoria registrado: quem revogou, quando, qual finalidade
```

## Versionamento de Consentimento

Quando a política de privacidade for alterada:
- Incremente a versão da política
- Obtenha novo consentimento para as finalidades que mudaram
- NÃO presuma que o consentimento anterior cobre novas finalidades
- Armazene qual versão cada usuário aceitou

## Checklist de Implementação

- [ ] Consentimento coletado antes do tratamento — nunca inferido
- [ ] Consentimento granular por finalidade — não um único checkbox genérico
- [ ] Versão da política registrada no momento do consentimento
- [ ] Endpoint de revogação implementado e testado
- [ ] Consentimento de menores (abaixo de 18 anos) requer aprovação dos responsáveis
- [ ] Registros de consentimento retidos pelo período do relacionamento mais 5 anos
- [ ] Evento de auditoria criado para cada concessão e revogação de consentimento
