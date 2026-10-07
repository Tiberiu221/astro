---
title: "n8n pentru redacții: de la webhook la articol publicat"
description: "Un flux automat care leagă un formular, un model AI și CMS-ul redacției, cu un editor care aprobă fiecare material înainte de publicare."
pubDate: 2026-09-22
author: "Radu Ionescu"
tags: ["n8n", "automatizări", "webhook", "redacție"]
---

n8n este o platformă open-source de automatizări în care construiești fluxuri din noduri: un declanșator, câțiva pași de procesare și o acțiune la final. Poate rula pe serverul propriu, deci datele redacției nu ajung la terți.

## Un flux tipic

1. **Webhook.** Un formular de pe site sau un sistem extern trimite un comunicat de presă către un URL generat de n8n.
2. **Curățare.** Un nod Code extrage titlul, textul și sursa, elimină formatarea în plus și verifică dacă materialul a mai fost primit.
3. **Draft cu AI.** Un model de limbaj propune titlul, un rezumat de două fraze și etichetele. Rezultatul rămâne draft.
4. **Aprobare.** Editorul primește draftul pe Slack sau pe email, cu opțiunile „aprobă” și „respinge”.
5. **Publicare.** După aprobare, n8n creează articolul prin API-ul CMS-ului sau face un commit în repository, iar build-ul site-ului pornește automat.

## Ce urmărești în producție

Fiecare execuție rămâne în istoricul n8n, cu datele de intrare și de ieșire, deci vezi exact unde s-a oprit un flux. Pentru erori configurezi un Error Workflow care anunță echipa, iar cheile API stau în Credentials, nu în noduri.

Automatizarea preia munca repetitivă. Decizia editorială rămâne la oameni.
