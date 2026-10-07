---
title: "Cum publici cu Claude Code fără să pierzi controlul"
description: "Agentul scrie cod și conținut în câteva minute, dar omul decide ce ajunge online: branch-uri, review și build-uri care opresc greșelile."
pubDate: 2026-10-06
author: "Ioana Marin"
tags: ["claude-code", "ai", "redacție", "git"]
---

Claude Code poate genera o pagină nouă, un import de date sau o corectură în zeci de fișiere în câteva minute. Viteza nu mai este problema. Problema este controlul: cine a decis schimbarea, cine a verificat-o și cum o anulezi dacă ceva iese prost.

## Reguli care funcționează într-o redacție

1. **Fiecare sarcină pe un branch separat.** Agentul lucrează izolat, iar diff-ul se citește într-un pull request, ca orice alt cod.
2. **Un fișier `CLAUDE.md` în repository.** Aici scrii convențiile echipei: cum se numesc fișierele, ce comenzi rulează testele și ce nu are voie să atingă, de exemplu configurația de producție.
3. **Validare automată înainte de publicare.** Într-un site Astro, schema colecției de articole oprește build-ul dacă lipsește autorul sau data. O eroare la build costă mai puțin decât o pagină stricată în producție.
4. **Omul aprobă publicarea.** Agentul pregătește, editorul citește varianta finală, nu doar rezumatul, apoi pornește deploy-ul.

## Ce câștigi

Sarcinile repetitive, precum redirect-urile, meta descrierile sau migrarea articolelor vechi, se termină în minute, nu în zile. Pentru că totul trece prin git, ai istoric complet și un `git revert` la îndemână când ceva nu merge.

Controlul nu înseamnă să lucrezi mai încet. Înseamnă să știi oricând ce s-a schimbat, de ce și cine a aprobat.
